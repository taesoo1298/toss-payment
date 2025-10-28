<?php

namespace App\Services\Payment;

use App\Exceptions\Payment\TossPaymentException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TossApiClient
{
    private string $apiUrl;
    private string $secretKey;
    private int $timeout;

    public function __construct()
    {
        $this->apiUrl = config('toss.api_url');
        $this->secretKey = config('toss.secret_key');
        $this->timeout = config('toss.timeout', 30);
    }

    /**
     * Get HTTP client with authentication.
     */
    private function client(): PendingRequest
    {
        return Http::withBasicAuth($this->secretKey, '')
            ->timeout($this->timeout)
            ->acceptJson()
            ->contentType('application/json');
    }

    /**
     * Confirm payment.
     */
    public function confirmPayment(string $paymentKey, array $data): array
    {
        $url = "{$this->apiUrl}/v1/payments/confirm";

        Log::info('Toss Payment Confirm Request', [
            'payment_key' => $paymentKey,
            'order_id' => $data['orderId'] ?? null,
        ]);

        $response = $this->client()->post($url, [
            'paymentKey' => $paymentKey,
            'orderId' => $data['orderId'],
            'amount' => $data['amount'],
        ]);

        if ($response->failed()) {
            $error = $response->json();
            Log::error('Toss Payment Confirm Failed', [
                'payment_key' => $paymentKey,
                'error' => $error,
            ]);

            throw new TossPaymentException(
                $error['message'] ?? 'Payment confirmation failed',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        $result = $response->json();

        Log::info('Toss Payment Confirm Success', [
            'payment_key' => $paymentKey,
            'status' => $result['status'] ?? null,
        ]);

        return $result;
    }

    /**
     * Get payment details.
     */
    public function getPayment(string $paymentKey): array
    {
        $url = "{$this->apiUrl}/v1/payments/{$paymentKey}";

        $response = $this->client()->get($url);

        if ($response->failed()) {
            $error = $response->json();
            throw new TossPaymentException(
                $error['message'] ?? 'Failed to get payment',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Get payment by order ID.
     */
    public function getPaymentByOrderId(string $orderId): array
    {
        $url = "{$this->apiUrl}/v1/payments/orders/{$orderId}";

        $response = $this->client()->get($url);

        if ($response->failed()) {
            $error = $response->json();
            throw new TossPaymentException(
                $error['message'] ?? 'Failed to get payment by order ID',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Cancel payment.
     */
    public function cancelPayment(string $paymentKey, array $data): array
    {
        $url = "{$this->apiUrl}/v1/payments/{$paymentKey}/cancel";

        Log::info('Toss Payment Cancel Request', [
            'payment_key' => $paymentKey,
            'cancel_reason' => $data['cancelReason'] ?? null,
        ]);

        $response = $this->client()->post($url, $data);

        if ($response->failed()) {
            $error = $response->json();
            Log::error('Toss Payment Cancel Failed', [
                'payment_key' => $paymentKey,
                'error' => $error,
            ]);

            throw new TossPaymentException(
                $error['message'] ?? 'Payment cancellation failed',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        $result = $response->json();

        Log::info('Toss Payment Cancel Success', [
            'payment_key' => $paymentKey,
            'cancel_amount' => $result['cancels'][0]['cancelAmount'] ?? null,
        ]);

        return $result;
    }

    /**
     * Request virtual account.
     */
    public function requestVirtualAccount(array $data): array
    {
        $url = "{$this->apiUrl}/v1/virtual-accounts";

        $response = $this->client()->post($url, $data);

        if ($response->failed()) {
            $error = $response->json();
            throw new TossPaymentException(
                $error['message'] ?? 'Virtual account request failed',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Request billing key for automatic payment.
     */
    public function requestBillingKey(string $customerKey, array $data): array
    {
        $url = "{$this->apiUrl}/v1/billing/authorizations/issue";

        $response = $this->client()->post($url, array_merge($data, [
            'customerKey' => $customerKey,
        ]));

        if ($response->failed()) {
            $error = $response->json();
            throw new TossPaymentException(
                $error['message'] ?? 'Billing key request failed',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Pay with billing key.
     */
    public function payWithBillingKey(string $billingKey, array $data): array
    {
        $url = "{$this->apiUrl}/v1/billing/{$billingKey}";

        $response = $this->client()->post($url, $data);

        if ($response->failed()) {
            $error = $response->json();
            throw new TossPaymentException(
                $error['message'] ?? 'Billing payment failed',
                $error['code'] ?? 'UNKNOWN_ERROR',
                $response->status()
            );
        }

        return $response->json();
    }
}
