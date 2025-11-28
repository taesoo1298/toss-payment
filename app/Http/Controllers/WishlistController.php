<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display user's wishlist page
     */
    public function index(Request $request)
    {
        $wishlists = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(function ($wishlist) {
                $product = $wishlist->product;
                return [
                    'id' => $wishlist->id,
                    'productId' => $product->id,
                    'name' => $product->name,
                    'price' => (int) $product->price,
                    'salePrice' => $product->sale_price ? (int) $product->sale_price : null,
                    'discountRate' => $product->discount_rate,
                    'image' => $product->main_image ?? 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80',
                    'rating' => (float) $product->rating,
                    'reviewCount' => $product->reviews_count,
                    'stock' => $product->stock,
                    'isInStock' => $product->stock > 0,
                    'addedAt' => $wishlist->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('MyPage/Wishlist', [
            'wishlists' => $wishlists,
        ]);
    }

    /**
     * Get user's wishlist (API)
     */
    public function list(Request $request)
    {
        $wishlists = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(function ($wishlist) {
                return [
                    'id' => $wishlist->id,
                    'productId' => $wishlist->product_id,
                    'addedAt' => $wishlist->created_at->toIso8601String(),
                ];
            });

        return response()->json(['wishlists' => $wishlists]);
    }

    /**
     * Check if product is in user's wishlist
     */
    public function check(Request $request, $productId)
    {
        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['inWishlist' => $exists]);
    }

    /**
     * Add product to wishlist
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // Check if already exists
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => '이미 찜한 상품입니다.',
            ], 422);
        }

        // Verify product exists and is active
        $product = Product::find($request->product_id);
        if (!$product || !$product->is_active) {
            return response()->json([
                'message' => '상품을 찾을 수 없습니다.',
            ], 404);
        }

        $wishlist = Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'message' => '찜 목록에 추가되었습니다.',
            'wishlist' => [
                'id' => $wishlist->id,
                'productId' => $wishlist->product_id,
            ],
        ], 201);
    }

    /**
     * Remove product from wishlist
     */
    public function destroy(Request $request, $id)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'message' => '찜 목록에서 찾을 수 없습니다.',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'message' => '찜 목록에서 삭제되었습니다.',
        ]);
    }

    /**
     * Remove product by product_id
     */
    public function destroyByProduct(Request $request, $productId)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'message' => '찜 목록에서 찾을 수 없습니다.',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'message' => '찜 목록에서 삭제되었습니다.',
        ]);
    }

    /**
     * Toggle wishlist status
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($wishlist) {
            // Remove from wishlist
            $wishlist->delete();
            return response()->json([
                'message' => '찜 목록에서 삭제되었습니다.',
                'inWishlist' => false,
            ]);
        } else {
            // Add to wishlist
            $wishlist = Wishlist::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
            ]);

            return response()->json([
                'message' => '찜 목록에 추가되었습니다.',
                'inWishlist' => true,
                'wishlist' => [
                    'id' => $wishlist->id,
                    'productId' => $wishlist->product_id,
                ],
            ]);
        }
    }
}
