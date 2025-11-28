<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display order complete page
     */
    public function complete(Request $request)
    {
        $orderId = $request->query('orderId');
        $paymentKey = $request->query('paymentKey');
        $amount = $request->query('amount');

        if (!$orderId) {
            return redirect()->route('home')->with('error', '주문 정보를 찾을 수 없습니다.');
        }

        // Find order by order_id
        $order = Order::with(['items.product', 'user'])
            ->where('order_id', $orderId)
            ->first();

        if (!$order) {
            return redirect()->route('home')->with('error', '주문을 찾을 수 없습니다.');
        }

        // Verify ownership if user is logged in
        if ($request->user() && $order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // Calculate estimated delivery (3 business days from now)
        $estimatedDelivery = now()->addDays(3)->locale('ko')->isoFormat('YYYY년 MM월 DD일 (ddd)');

        // Format order items
        $items = $order->items->map(function ($item) {
            return [
                'id' => $item->product_id,
                'name' => $item->product_name,
                'price' => (int) $item->price,
                'quantity' => $item->quantity,
                'image' => $item->product?->main_image ?? 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
            ];
        });

        // Customer info
        $customerInfo = [
            'name' => $order->customer_name,
            'email' => $order->customer_email,
            'phone' => $order->customer_phone,
        ];

        // Shipping info
        $shippingInfo = [
            'recipient' => $order->recipient_name,
            'phone' => $order->recipient_phone,
            'address' => $order->address . ' ' . $order->address_detail,
            'message' => $order->delivery_memo,
        ];

        return Inertia::render('Payment/OrderComplete', [
            'orderId' => $order->order_id,
            'paymentKey' => $paymentKey,
            'amount' => (int) $order->total_amount,
            'orderDate' => $order->created_at->locale('ko')->isoFormat('YYYY년 MM월 DD일 HH:mm'),
            'estimatedDelivery' => $estimatedDelivery,
            'items' => $items,
            'customerInfo' => $customerInfo,
            'shippingInfo' => $shippingInfo,
        ]);
    }

    /**
     * Display order detail by ID
     */
    public function show(Request $request, $id)
    {
        // Find order by order_id
        $order = Order::with(['items.product', 'user'])
            ->where('order_id', $id)
            ->orWhere('id', $id)
            ->first();

        if (!$order) {
            return redirect()->route('mypage.orders')->with('error', '주문을 찾을 수 없습니다.');
        }

        // Verify ownership
        if ($request->user() && $order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // Calculate estimated delivery
        $estimatedDelivery = now()->addDays(3)->locale('ko')->isoFormat('YYYY년 MM월 DD일 (ddd)');

        // Format order items
        $items = $order->items->map(function ($item) {
            return [
                'id' => $item->product_id,
                'name' => $item->product_name,
                'price' => (int) $item->price,
                'quantity' => $item->quantity,
                'image' => $item->product?->main_image ?? 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
            ];
        });

        // Customer info
        $customerInfo = [
            'name' => $order->customer_name,
            'email' => $order->customer_email,
            'phone' => $order->customer_phone,
        ];

        // Shipping info
        $shippingInfo = [
            'recipient' => $order->recipient_name,
            'phone' => $order->recipient_phone,
            'address' => $order->address . ($order->address_detail ? ' ' . $order->address_detail : ''),
            'message' => $order->delivery_memo,
        ];

        return Inertia::render('Payment/OrderComplete', [
            'orderId' => $order->order_id,
            'amount' => (int) $order->total_amount,
            'orderDate' => $order->created_at->locale('ko')->isoFormat('YYYY년 MM월 DD일 HH:mm'),
            'estimatedDelivery' => $estimatedDelivery,
            'items' => $items,
            'customerInfo' => $customerInfo,
            'shippingInfo' => $shippingInfo,
        ]);
    }
}
