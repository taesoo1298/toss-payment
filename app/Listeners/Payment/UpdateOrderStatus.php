<?php

namespace App\Listeners\Payment;

use App\Events\Payment\PaymentCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class UpdateOrderStatus implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentCompleted $event): void
    {
        $payment = $event->payment;

        // Update order status in your order management system
        // Example:
        // $order = Order::where('order_id', $payment->order_id)->first();
        // if ($order) {
        //     $order->update([
        //         'status' => 'paid',
        //         'paid_at' => $payment->approved_at,
        //     ]);
        // }

        Log::info('Order status updated after payment', [
            'order_id' => $payment->order_id,
            'payment_key' => $payment->payment_key,
        ]);
    }
}
