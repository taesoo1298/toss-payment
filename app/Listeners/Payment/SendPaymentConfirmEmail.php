<?php

namespace App\Listeners\Payment;

use App\Events\Payment\PaymentCompleted;
use App\Mail\PaymentConfirmationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendPaymentConfirmationEmail implements ShouldQueue
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

        if ($payment->customer_email) {
            Mail::to($payment->customer_email)
                ->send(new PaymentConfirmationMail($payment));
        }
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(PaymentCompleted $event): bool
    {
        return !empty($event->payment->customer_email);
    }
}
