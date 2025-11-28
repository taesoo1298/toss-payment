<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\UserCoupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCouponController extends Controller
{
    /**
     * Display a listing of user coupons
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $coupons = UserCoupon::with('coupon')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($userCoupon) {
                $coupon = $userCoupon->coupon;

                return [
                    'id' => (string) $userCoupon->id,
                    'code' => $coupon->code,
                    'name' => $coupon->name,
                    'description' => $coupon->description,
                    'discountType' => $coupon->discount_type,
                    'discountValue' => (float) $coupon->discount_value,
                    'minPurchaseAmount' => (float) $coupon->min_purchase_amount,
                    'maxDiscountAmount' => $coupon->max_discount_amount ? (float) $coupon->max_discount_amount : null,
                    'expiryDate' => $coupon->valid_until ? $coupon->valid_until->format('Y-m-d') : null,
                    'isUsed' => $userCoupon->status === 'used',
                    'usedDate' => $userCoupon->used_at ? $userCoupon->used_at->format('Y-m-d') : null,
                    'isExpired' => $userCoupon->status === 'expired' || $coupon->isExpired(),
                ];
            });

        // For Inertia page
        if ($request->wantsJson()) {
            return response()->json($coupons);
        }

        return Inertia::render('MyPage/Coupons', [
            'coupons' => $coupons,
        ]);
    }

    /**
     * Register a coupon by code
     */
    public function register(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return response()->json([
                'message' => '유효하지 않은 쿠폰 코드입니다.',
            ], 404);
        }

        // Check if coupon is available
        if (!$coupon->isAvailable()) {
            return response()->json([
                'message' => '사용할 수 없는 쿠폰입니다.',
            ], 422);
        }

        // Check if user already has this coupon
        $existing = UserCoupon::where('user_id', $request->user()->id)
            ->where('coupon_id', $coupon->id)
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => '이미 등록된 쿠폰입니다.',
            ], 422);
        }

        // Register coupon to user
        $userCoupon = UserCoupon::create([
            'user_id' => $request->user()->id,
            'coupon_id' => $coupon->id,
            'status' => 'available',
            'issued_at' => now(),
        ]);

        return response()->json([
            'message' => '쿠폰이 등록되었습니다!',
            'coupon' => [
                'id' => (string) $userCoupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'description' => $coupon->description,
                'discountType' => $coupon->discount_type,
                'discountValue' => (float) $coupon->discount_value,
                'minPurchaseAmount' => (float) $coupon->min_purchase_amount,
                'maxDiscountAmount' => $coupon->max_discount_amount ? (float) $coupon->max_discount_amount : null,
                'expiryDate' => $coupon->valid_until ? $coupon->valid_until->format('Y-m-d') : null,
                'isUsed' => false,
                'isExpired' => false,
            ],
        ], 201);
    }

    /**
     * Get available coupons for checkout
     */
    public function available(Request $request)
    {
        $user = $request->user();
        $subtotal = $request->query('subtotal', 0);

        $coupons = UserCoupon::with('coupon')
            ->where('user_id', $user->id)
            ->where('status', 'available')
            ->get()
            ->filter(function ($userCoupon) {
                return $userCoupon->coupon->isAvailable();
            })
            ->map(function ($userCoupon) use ($subtotal) {
                $coupon = $userCoupon->coupon;

                return [
                    'id' => (string) $userCoupon->id,
                    'code' => $coupon->code,
                    'name' => $coupon->name,
                    'description' => $coupon->description,
                    'discountType' => $coupon->discount_type,
                    'discountValue' => (float) $coupon->discount_value,
                    'minPurchaseAmount' => (float) $coupon->min_purchase_amount,
                    'maxDiscountAmount' => $coupon->max_discount_amount ? (float) $coupon->max_discount_amount : null,
                    'expiryDate' => $coupon->valid_until ? $coupon->valid_until->format('Y-m-d') : null,
                    'discountAmount' => $coupon->getDiscountAmount($subtotal),
                    'canUse' => $subtotal >= $coupon->min_purchase_amount,
                ];
            })
            ->values();

        return response()->json($coupons);
    }

    /**
     * Display the specified coupon
     */
    public function show(Request $request, UserCoupon $userCoupon)
    {
        // Verify ownership
        if ($userCoupon->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $coupon = $userCoupon->coupon;

        return response()->json([
            'id' => (string) $userCoupon->id,
            'code' => $coupon->code,
            'name' => $coupon->name,
            'description' => $coupon->description,
            'discountType' => $coupon->discount_type,
            'discountValue' => (float) $coupon->discount_value,
            'minPurchaseAmount' => (float) $coupon->min_purchase_amount,
            'maxDiscountAmount' => $coupon->max_discount_amount ? (float) $coupon->max_discount_amount : null,
            'expiryDate' => $coupon->valid_until ? $coupon->valid_until->format('Y-m-d') : null,
            'isUsed' => $userCoupon->status === 'used',
            'usedDate' => $userCoupon->used_at ? $userCoupon->used_at->format('Y-m-d') : null,
            'isExpired' => $userCoupon->status === 'expired' || $coupon->isExpired(),
        ]);
    }

    /**
     * Store is not needed - use register() instead
     */
    public function store(Request $request)
    {
        return $this->register($request);
    }

    /**
     * Update is not applicable for user coupons
     */
    public function update(Request $request, string $id)
    {
        return response()->json([
            'message' => 'Method not allowed',
        ], 405);
    }

    /**
     * Remove is not applicable - coupons should not be deleted
     */
    public function destroy(string $id)
    {
        return response()->json([
            'message' => 'Method not allowed',
        ], 405);
    }
}
