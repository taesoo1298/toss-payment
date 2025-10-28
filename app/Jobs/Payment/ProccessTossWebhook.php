<?php

namespace App\Jobs\Payment;

use App\Events\Payment\PaymentCompleted;
use App\Models\Payment;
use App\Services\Payment\TossApiClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessTossWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public array $payload
    ) {}

    /**
     * Execute the job.
     */
    public function handle(TossApiClient $apiClient): void
    {
        $eventType = $this->payload['eventType'] ?? null;
        $data = $this->payload['data'] ?? [];

        Log::info('Processing Toss webhook', [
            'event_type' => $eventType,
            'payment_key' => $data['paymentKey'] ?? null,
        ]);

        match($eventType) {
            'PAYMENT.CONFIRMATION_COMPLETED' => $this->handlePaymentConfirmation($data, $apiClient),
            'PAYMENT.STATUS_CHANGED' => $this->handleStatusChange($data),
            'VIRTUAL_ACCOUNT.DEPOSIT_COMPLETED' => $this->handleVirtualAccountDeposit($data, $apiClient),
            default => Log::warning('Unknown webhook event type', ['type' => $eventType]),
        };
    }

    /**
     * Handle payment confirmation webhook.
     */
    private function handlePaymentConfirmation(array $data, TossApiClient $apiClient): void
    {
        $paymentKey = $data['paymentKey'] ?? null;

        if (!$paymentKey) {
            Log::error('Payment key not found in webhook data');
            return;
        }

        // Get latest payment info from Toss API
        $paymentData = $apiClient->getPayment($paymentKey);

        // Find payment in database
        $payment = Payment::where('payment_key', $paymentKey)->first();

        if (!$payment) {
            Log::warning('Payment not found in database', ['payment_key' => $paymentKey]);
            return;
        }

        // Update payment if not already completed
        if (!$payment->isCompleted()) {
            $payment->update([
                'status' => 'done',
                'approved_at' => now(),
            ]);

            event(new PaymentCompleted($payment));

            Log::info('Payment confirmed via webhook', [
                'payment_key' => $paymentKey,
                'order_id' => $payment->order_id,
            ]);
        }
    }

    /**
     * Handle payment status change webhook.
     */
    private function handleStatusChange(array $data): void
    {
        $paymentKey = $data['paymentKey'] ?? null;
        $status = $data['status'] ?? null;

        if (!$paymentKey || !$status) {
            return;
        }

        $payment = Payment::where('payment_key', $paymentKey)->first();

        if ($payment && $payment->status->value !== $status) {
            $payment->update(['status' => $status]);

            Log::info('Payment status changed', [
                'payment_key' => $paymentKey,
                'new_status' => $status,
            ]);
        }
    }

    /**
     * Handle virtual account deposit webhook.
     */
    private function handleVirtualAccountDeposit(array $data, TossApiClient $apiClient): void
    {
        $paymentKey = $data['paymentKey'] ?? null;

        if (!$paymentKey) {
            return;
        }

        // Get latest payment info
        $paymentData = $apiClient->getPayment($paymentKey);

        $payment = Payment::where('payment_key', $paymentKey)->first();

        if ($payment) {
            $payment->update([
                'status' => 'done',
                'approved_at' => now(),
            ]);

            event(new PaymentCompleted($payment));

            Log::info('Virtual account deposit completed', [
                'payment_key' => $paymentKey,
                'order_id' => $payment->order_id,
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Webhook processing job failed', [
            'event_type' => $this->payload['eventType'] ?? 'unknown',
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
