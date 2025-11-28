<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get current cart (for both members and guests)
     */
    private function getCurrentCart(): Cart
    {
        if (auth()->check()) {
            return Cart::firstOrCreate(['user_id' => auth()->id()]);
        }

        $sessionId = session()->getId();
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    /**
     * Display cart page
     */
    public function index()
    {
        $cart = $this->getCurrentCart();
        $cart->load(['items.product']);

        $cartItems = $cart->items->map(function ($item) {
            return [
                'id' => $item->product->id,
                'name' => $item->product->name,
                'description' => $item->product->description,
                'price' => (float) $item->price,
                'originalPrice' => $item->product->original_price ? (float) $item->product->original_price : null,
                'image' => $item->product->image_url,
                'category' => $item->product->category,
                'quantity' => $item->quantity,
                'selected' => true, // Default to selected
                'cartItemId' => $item->id, // Include cart item ID for operations
            ];
        })->values()->toArray();

        return Inertia::render('Cart/Cart', [
            'initialCartItems' => $cartItems,
            'cartId' => $cart->id,
        ]);
    }

    /**
     * Get cart summary (for header badge)
     */
    public function summary()
    {
        $cart = $this->getCurrentCart();

        return response()->json([
            'totalItems' => $cart->total_items,
            'total' => (float) $cart->total,
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'options' => 'nullable|array',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Check stock
        if ($validated['quantity'] > $product->stock) {
            return response()->json([
                'message' => '재고가 부족합니다.',
                'available_stock' => $product->stock,
            ], 422);
        }

        DB::transaction(function () use ($validated, $product) {
            $cart = $this->getCurrentCart();

            // Check if item already exists (without options for now)
            $existingItem = $cart->items()
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($existingItem) {
                // Update quantity
                $newQuantity = $existingItem->quantity + $validated['quantity'];
                if ($newQuantity > $product->stock) {
                    $newQuantity = $product->stock;
                }
                $existingItem->updateQuantity($newQuantity);
            } else {
                // Create new cart item
                $discount = $product->original_price ? ($product->original_price - $product->price) : 0;

                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $validated['product_id'],
                    'quantity' => $validated['quantity'],
                    'price' => $product->price,
                    'discount' => $discount,
                    'total' => $product->price * $validated['quantity'],
                    'options' => $validated['options'] ?? null,
                ]);
            }

            $cart->recalculateTotals();
        });

        return response()->json([
            'message' => '장바구니에 추가되었습니다.',
            'cart' => $this->getCurrentCart()->load('items'),
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(Request $request, $productId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCurrentCart();

        $cartItem = $cart->items()
            ->where('product_id', $productId)
            ->firstOrFail();

        if (!$cartItem->updateQuantity($validated['quantity'])) {
            return response()->json([
                'message' => '재고가 부족하거나 수량이 잘못되었습니다.',
                'available_stock' => $cartItem->product->stock,
            ], 422);
        }

        return response()->json([
            'message' => '수량이 업데이트되었습니다.',
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy($productId)
    {
        $cart = $this->getCurrentCart();

        $cartItem = $cart->items()
            ->where('product_id', $productId)
            ->firstOrFail();

        $cartItem->delete();
        $cart->recalculateTotals();

        return response()->json([
            'message' => '상품이 삭제되었습니다.',
        ]);
    }

    /**
     * Remove multiple items from cart
     */
    public function destroyMultiple(Request $request)
    {
        $validated = $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'required|integer|exists:products,id',
        ]);

        $cart = $this->getCurrentCart();

        $cart->items()
            ->whereIn('product_id', $validated['product_ids'])
            ->delete();

        $cart->recalculateTotals();

        return response()->json([
            'message' => '선택한 상품이 삭제되었습니다.',
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        $cart = $this->getCurrentCart();
        $cart->clear();

        return response()->json([
            'message' => '장바구니가 비워졌습니다.',
        ]);
    }

    /**
     * Apply coupon
     */
    public function applyCoupon(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $coupon = Coupon::where('code', $validated['code'])->first();

        if (!$coupon) {
            return response()->json(['message' => '유효하지 않은 쿠폰입니다.'], 422);
        }

        $cart = $this->getCurrentCart();

        if (!$cart->applyCoupon($coupon)) {
            return response()->json(['message' => '쿠폰을 적용할 수 없습니다.'], 422);
        }

        return response()->json([
            'message' => '쿠폰이 적용되었습니다.',
        ]);
    }

    /**
     * Remove coupon
     */
    public function removeCoupon()
    {
        $cart = $this->getCurrentCart();
        $cart->removeCoupon();

        return response()->json([
            'message' => '쿠폰이 제거되었습니다.',
        ]);
    }

    /**
     * Merge guest cart to user cart (called after login)
     */
    public function mergeGuestCart(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => '인증이 필요합니다.'], 401);
        }

        $sessionId = $request->input('session_id', session()->getId());

        DB::transaction(function () use ($sessionId) {
            $this->mergeGuestCartToUser($sessionId, auth()->id());
        });

        return response()->json([
            'message' => '장바구니가 병합되었습니다.',
        ]);
    }

    /**
     * Internal method to merge guest cart to user cart
     */
    private function mergeGuestCartToUser(string $sessionId, int $userId): void
    {
        $guestCart = Cart::where('session_id', $sessionId)->first();
        if (!$guestCart || $guestCart->total_items === 0) {
            return;
        }

        $userCart = Cart::firstOrCreate(['user_id' => $userId]);

        foreach ($guestCart->items as $guestItem) {
            $existingItem = $userCart->items()
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existingItem) {
                $product = $guestItem->product;
                $newQuantity = min(
                    $existingItem->quantity + $guestItem->quantity,
                    $product->stock
                );
                $existingItem->updateQuantity($newQuantity);
            } else {
                $guestItem->update(['cart_id' => $userCart->id]);
            }
        }

        $userCart->recalculateTotals();
        $guestCart->delete();
    }
}
