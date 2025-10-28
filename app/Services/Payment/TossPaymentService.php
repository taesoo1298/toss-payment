<?php

namespace App\Services\Payment;

use App\Enums\Payment\PaymentStatus;
use App\Events\Payment\PaymentCancelled;
use App\Events\Payment\PaymentCompleted;
use App\Events\Payment\PaymentFailed;
use App\Exceptions\Payment\TossPaymentException;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Repositories\Payment\PaymentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TossPaymentService
{
    public function __construct(
        private TossApiClient $apiClient,
        private PaymentRepository $paymentRepository
    ) {}

    /**
     * Prepare payment and generate order ID.
     */
    public function prepare(array $data): array
    {
        $orderId = $this->generateOrderId();

        $payment = $this->paymentRepository->create([
            'user_id' => auth()->id(),
            'order_id' => $orderId,
            'order_name' => $data['order_name'],
            'customer_name' => $data['customer_name'] ?? auth()->user()?->name,
            'customer_email' => $data['customer_email'] ?? auth()->user()?->email,
            'customer_mobile_phone' => $data['customer_mobile_phone'] ?? null,
            'method' => $data['method'],
            'status' => PaymentStatus::READY,
            'total_amount' => $data['amount'],
            'balance_amount' => $data['amount'],
            'supplied_amount' => $data['supplied_amount'] ?? 0,
            'vat' => $data['vat'] ?? 0,
            'tax_free_amount' => $data['tax_free_amount'] ?? 0,
            'discount_amount' => $data['discount_amount'] ?? 0,
            'metadata' => $data['metadata'] ?? null,
            'requested_at' => now(),
        ]);

        return [
            'order_id' => $orderId,
            'order_name' => $payment->order_name,
            'amount' => $payment->total_amount,
            'method' => $this->mapMethodForSdk($payment->method->value),
            'customer_name' => $payment->customer_name,
            'customer_email' => $payment->customer_email,
            'success_url' => config('toss.success_url'),
            'fail_url' => config('toss.fail_url'),
        ];
    }

    /**
     * Confirm payment with Toss Payments API.
     */
    public function confirm(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            // 1. Find payment by order_id
            $payment = $this->paymentRepository->findByOrderId($data['order_id']);

            if (!$payment) {
                throw new TossPaymentException(
                    '결제 정보를 찾을 수 없습니다.',
                    'PAYMENT_NOT_FOUND'
                );
            }

            // 2. Verify amount
            if ($payment->total_amount !== $data['amount']) {
                throw new TossPaymentException(
                    '결제 금액이 일치하지 않습니다.',
                    'AMOUNT_MISMATCH'
                );
            }

            // 3. Check if already confirmed
            if ($payment->isCompleted()) {
                return $payment;
            }

            try {
                // 4. Call Toss Payments API
                $response = $this->apiClient->confirmPayment($data['payment_key'], [
                    'orderId' => $data['order_id'],
                    'amount' => $data['amount'],
                ]);

                // 5. Update payment with response
                $payment = $this->updatePaymentFromResponse($payment, $response);

                // 6. Create transaction record
                $this->createTransaction($payment, PaymentTransaction::TYPE_PAYMENT, $response);

                // 7. Dispatch event
                event(new PaymentCompleted($payment));

                return $payment;

            } catch (TossPaymentException $e) {
                // Update payment with failure information
                $payment->update([
                    'status' => PaymentStatus::ABORTED,
                    'failure_code' => $e->getCode(),
                    'failure_message' => $e->getMessage(),
                ]);

                event(new PaymentFailed($payment, $e->getMessage()));

                throw $e;
            }
        });
    }

    /**
     * Cancel payment.
     */
    public function cancel(Payment $payment, array $data): Payment
    {
        return DB::transaction(function () use ($payment, $data) {
            // 1. Verify payment can be canceled
            if (!$payment->isCancelable()) {
                throw new TossPaymentException(
                    '취소할 수 없는 결제입니다.',
                    'NOT_CANCELABLE'
                );
            }

            // 2. Determine cancel amount (full or partial)
            $cancelAmount = $data['cancel_amount'] ?? $payment->balance_amount;

            if ($cancelAmount > $payment->balance_amount) {
                throw new TossPaymentException(
                    '취소 가능한 금액을 초과했습니다.',
                    'CANCEL_AMOUNT_EXCEEDED'
                );
            }

            // 3. Call Toss Payments API
            $response = $this->apiClient->cancelPayment($payment->payment_key, [
                'cancelReason' => $data['cancel_reason'],
                'cancelAmount' => $cancelAmount,
                'refundableAmount' => $data['refundable_amount'] ?? $cancelAmount,
                'taxFreeAmount' => $data['tax_free_amount'] ?? 0,
            ]);

            // 4. Update payment
            $isPartialCancel = $cancelAmount < $payment->balance_amount;

            $payment->update([
                'status' => $isPartialCancel
                    ? PaymentStatus::PARTIAL_CANCELED
                    : PaymentStatus::CANCELED,
                'balance_amount' => $payment->balance_amount - $cancelAmount,
                'cancel_amount' => $payment->cancel_amount + $cancelAmount,
                'canceled_at' => now(),
            ]);

            // 5. Create transaction record
            $this->createTransaction(
                $payment,
                $isPartialCancel
                    ? PaymentTransaction::TYPE_PARTIAL_CANCEL
                    : PaymentTransaction::TYPE_CANCEL,
                $response,
                $data['cancel_reason']
            );

            // 6. Dispatch event
            event(new PaymentCancelled($payment, $cancelAmount));

            return $payment->fresh();
        });
    }

    /**
     * Get payment details from Toss Payments API.
     */
    public function getPaymentDetails(string $paymentKey): array
    {
        return $this->apiClient->getPayment($paymentKey);
    }

    /**
     * Update payment from Toss API response.
     */
    private function updatePaymentFromResponse(Payment $payment, array $response): Payment
    {
        $updateData = [
            'payment_key' => $response['paymentKey'],
            'status' => $this->mapTossStatus($response['status']),
            'approved_at' => isset($response['approvedAt'])
                ? \Carbon\Carbon::parse($response['approvedAt'])
                : null,
            'receipt_url' => $response['receipt']['url'] ?? null,
            'checkout_url' => $response['checkout']['url'] ?? null,
        ];

        // Card specific fields
        if (isset($response['card'])) {
            $updateData['card_company'] = $response['card']['company'] ?? null;
            $updateData['card_number'] = $response['card']['number'] ?? null;
            $updateData['card_type'] = $response['card']['cardType'] ?? null;
        }

        // Virtual account specific fields
        if (isset($response['virtualAccount'])) {
            $updateData['metadata'] = array_merge(
                $payment->metadata ?? [],
                ['virtual_account' => $response['virtualAccount']]
            );
        }

        $payment->update($updateData);

        return $payment->fresh();
    }

    /**
     * Create payment transaction record.
     */
    private function createTransaction(
        Payment $payment,
        string $type,
        array $rawData,
        ?string $reason = null
    ): PaymentTransaction {
        return $payment->transactions()->create([
            'transaction_key' => $rawData['transactionKey'] ?? null,
            'type' => $type,
            'amount' => match($type) {
                PaymentTransaction::TYPE_PAYMENT => $payment->total_amount,
                PaymentTransaction::TYPE_CANCEL,
                PaymentTransaction::TYPE_PARTIAL_CANCEL => $rawData['cancels'][0]['cancelAmount'] ?? 0,
                default => 0,
            },
            'reason' => $reason,
            'raw_data' => $rawData,
            'processed_at' => now(),
        ]);
    }

    /**
     * Map Toss payment status to our enum.
     */
    private function mapTossStatus(string $tossStatus): PaymentStatus
    {
        return match(strtoupper($tossStatus)) {
            'READY' => PaymentStatus::READY,
            'IN_PROGRESS' => PaymentStatus::IN_PROGRESS,
            'WAITING_FOR_DEPOSIT' => PaymentStatus::WAITING_FOR_DEPOSIT,
            'DONE' => PaymentStatus::DONE,
            'CANCELED' => PaymentStatus::CANCELED,
            'PARTIAL_CANCELED' => PaymentStatus::PARTIAL_CANCELED,
            'ABORTED' => PaymentStatus::ABORTED,
            'EXPIRED' => PaymentStatus::EXPIRED,
            default => PaymentStatus::PENDING,
        };
    }

    /**
     * Generate unique order ID.
     */
    private function generateOrderId(): string
    {
        return 'ORDER_' . date('YmdHis') . '_' . Str::upper(Str::random(8));
    }

    /**
     * Map payment method to Toss SDK format.
     */
    private function mapMethodForSdk(string $method): string
    {
        return match($method) {
            'card' => 'CARD',
            'virtual_account' => 'VIRTUAL_ACCOUNT',
            'transfer' => 'TRANSFER',
            'mobile_phone' => 'MOBILE_PHONE',
            'culture_gift_certificate' => 'CULTURE_GIFT_CERTIFICATE',
            'book_gift_certificate' => 'BOOK_GIFT_CERTIFICATE',
            'game_gift_certificate' => 'GAME_GIFT_CERTIFICATE',
            'easy_pay' => 'EASY_PAY',
            default => strtoupper($method),
        };
    }
}
