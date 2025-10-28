<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'payment_key' => $this->payment_key,
            'order_name' => $this->order_name,

            // Customer information
            'customer' => [
                'name' => $this->customer_name,
                'email' => $this->customer_email,
                'phone' => $this->customer_mobile_phone,
            ],

            // Payment information
            'method' => [
                'type' => $this->method->value,
                'label' => $this->method->label(),
            ],
            'status' => [
                'code' => $this->status->value,
                'label' => $this->status->label(),
            ],

            // Amount information
            'amounts' => [
                'total' => $this->total_amount,
                'balance' => $this->balance_amount,
                'supplied' => $this->supplied_amount,
                'vat' => $this->vat,
                'tax_free' => $this->tax_free_amount,
                'discount' => $this->discount_amount,
                'canceled' => $this->cancel_amount,
            ],

            // Card information (if available)
            'card' => $this->when($this->card_company, [
                'company' => $this->card_company,
                'number' => $this->card_number,
                'type' => $this->card_type,
            ]),

            // URLs
            'receipt_url' => $this->receipt_url,
            'checkout_url' => $this->checkout_url,

            // Failure information (if failed)
            'failure' => $this->when($this->isFailed(), [
                'code' => $this->failure_code,
                'message' => $this->failure_message,
            ]),

            // Timestamps
            'requested_at' => $this->requested_at?->toIso8601String(),
            'approved_at' => $this->approved_at?->toIso8601String(),
            'canceled_at' => $this->canceled_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Relations
            'transactions' => PaymentTransactionResource::collection(
                $this->whenLoaded('transactions')
            ),

            // Meta information
            'meta' => [
                'is_completed' => $this->isCompleted(),
                'is_cancelable' => $this->isCancelable(),
                'is_failed' => $this->isFailed(),
                'cancelable_amount' => $this->getCancelableAmount(),
            ],

            // Additional metadata
            'metadata' => $this->metadata,
        ];
    }
}
