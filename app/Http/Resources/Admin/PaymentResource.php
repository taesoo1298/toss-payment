<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Disable data wrapping
     */
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->order_id,
            'paymentKey' => $this->payment_key,
            'orderName' => $this->order_name,

            // Customer Info
            'customerName' => $this->customer_name,
            'customerEmail' => $this->customer_email,
            'customerMobilePhone' => $this->customer_mobile_phone,

            // Payment Info
            'method' => $this->method->value ?? $this->method,
            'methodLabel' => $this->method->label() ?? $this->method,
            'status' => $this->status->value ?? $this->status,
            'statusLabel' => $this->status->label() ?? $this->status,

            // Timestamps
            'requestedAt' => $this->requested_at?->toISOString(),
            'approvedAt' => $this->approved_at?->toISOString(),
            'canceledAt' => $this->canceled_at?->toISOString(),

            // Amount Info
            'totalAmount' => $this->total_amount,
            'balanceAmount' => $this->balance_amount,
            'suppliedAmount' => $this->supplied_amount,
            'vat' => $this->vat,
            'taxFreeAmount' => $this->tax_free_amount,
            'discountAmount' => $this->discount_amount,
            'cancelAmount' => $this->cancel_amount,

            // Additional Info
            'currency' => $this->currency,
            'country' => $this->country,

            // Card Info (if card payment)
            'cardCompany' => $this->card_company,
            'cardNumber' => $this->card_number,
            'cardType' => $this->card_type,

            // URLs
            'receiptUrl' => $this->receipt_url,
            'checkoutUrl' => $this->checkout_url,

            // Failure Info
            'failureCode' => $this->failure_code,
            'failureMessage' => $this->failure_message,

            // Metadata
            'metadata' => $this->metadata,

            // Relations
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),

            'order' => $this->whenLoaded('order', function () {
                return [
                    'id' => $this->order->id,
                    'orderId' => $this->order->order_id,
                    'status' => $this->order->status,
                    'statusLabel' => $this->order->status_label,
                    'totalAmount' => $this->order->total_amount,
                    'items' => $this->order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'productName' => $item->product_name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'subtotal' => $item->subtotal,
                        ];
                    }),
                ];
            }),

            'transactions' => $this->whenLoaded('transactions', function () {
                return $this->transactions->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'reason' => $transaction->reason,
                        'processedAt' => $transaction->processed_at?->toISOString(),
                        'createdAt' => $transaction->created_at->toISOString(),
                    ];
                });
            }),

            // Computed
            'isCancelable' => $this->isCancelable(),
            'cancelableAmount' => $this->getCancelableAmount(),

            // Timestamps
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
