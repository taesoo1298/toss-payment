<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\UserCoupon;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyPageController extends Controller
{
    /**
     * Display MyPage Dashboard
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Order statistics
        $stats = [
            'preparing' => Order::where('user_id', $user->id)->where('status', 'preparing')->count(),
            'shipping' => Order::where('user_id', $user->id)->where('status', 'shipping')->count(),
            'delivered' => Order::where('user_id', $user->id)->where('status', 'delivered')->count(),
            'points' => 0, // TODO: Implement points system
            'coupons' => UserCoupon::where('user_id', $user->id)
                ->where('status', 'available')
                ->whereHas('coupon', function ($query) {
                    $query->where('is_active', true)
                        ->where(function ($q) {
                            $q->whereNull('valid_until')
                                ->orWhere('valid_until', '>=', now());
                        });
                })
                ->count(),
            'wishlist' => Wishlist::where('user_id', $user->id)->count()
        ];

        // Recent orders (최근 3개)
        $recentOrders = Order::with('items.product')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => (string) $order->id,
                    'orderId' => $order->order_id,
                    'date' => $order->created_at->format('Y-m-d'),
                    'status' => $order->status,
                    'statusLabel' => $order->status_label,
                    'itemCount' => $order->items->count(),
                    'totalAmount' => (int) $order->total_amount,
                    'thumbnail' => $order->items->first()?->product?->main_image ??
                                  'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
                ];
            });

        return Inertia::render('MyPage/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Display Order History
     */
    public function orderHistory(Request $request)
    {
        $user = $request->user();
        $status = $request->query('status');

        $query = Order::with('items.product')
            ->where('user_id', $user->id);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => (string) $order->id,
                    'orderId' => $order->order_id,
                    'orderDate' => $order->created_at->format('Y-m-d H:i:s'),
                    'status' => $order->status,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->product_id,
                            'name' => $item->product_name,
                            'price' => (int) $item->price,
                            'quantity' => $item->quantity,
                            'image' => $item->product?->main_image ??
                                      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
                        ];
                    }),
                    'totalAmount' => (int) $order->total_amount,
                    'shippingFee' => (int) ($order->shipping_cost ?? 0),
                    'trackingNumber' => $order->tracking_number,
                ];
            });

        return Inertia::render('MyPage/OrderHistory', [
            'orders' => $orders,
        ]);
    }

    /**
     * Cancel an order
     */
    public function cancelOrder(Request $request, Order $order)
    {
        // Verify ownership
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // Check if order can be cancelled
        if (!$order->canCancel()) {
            return back()->with('error', '이 주문은 취소할 수 없습니다.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $order->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancel_reason' => $request->reason,
        ]);

        // TODO: Process refund via Toss Payments API

        return back()->with('success', '주문이 취소되었습니다.');
    }

    /**
     * Request refund for an order
     */
    public function requestRefund(Request $request, Order $order)
    {
        // Verify ownership
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // Check if order can be refunded
        if (!$order->canRefund()) {
            return back()->with('error', '이 주문은 반품할 수 없습니다.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
            'items' => 'required|array',
        ]);

        // TODO: Create refund request record
        // TODO: Process refund via Toss Payments API

        return back()->with('success', '반품 신청이 완료되었습니다.');
    }

    /**
     * Request exchange for an order
     */
    public function requestExchange(Request $request, Order $order)
    {
        // Verify ownership
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // Check if order can be exchanged
        if ($order->status !== 'delivered') {
            return back()->with('error', '배송완료된 주문만 교환 신청이 가능합니다.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
            'items' => 'required|array',
        ]);

        // TODO: Create exchange request record

        return back()->with('success', '교환 신청이 완료되었습니다.');
    }
}
