<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Disable data wrapping
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->order_id,
            'status' => $this->status,
            'statusLabel' => $this->status_label,
            'statusColor' => $this->status_color,

            // Customer Info
            'customerName' => $this->customer_name,
            'customerEmail' => $this->customer_email,
            'customerPhone' => $this->customer_phone,

            // Shipping Info
            'recipientName' => $this->recipient_name,
            'recipientPhone' => $this->recipient_phone,
            'postalCode' => $this->postal_code,
            'address' => $this->address,
            'addressDetail' => $this->address_detail,
            'deliveryMemo' => $this->delivery_memo,

            // Pricing
            'subtotal' => (float) $this->subtotal,
            'shippingCost' => (float) $this->shipping_cost,
            'couponDiscount' => (float) $this->coupon_discount,
            'totalAmount' => (float) $this->total_amount,

            // Relations
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'coupon' => $this->when($this->coupon, function () {
                return [
                    'id' => $this->coupon->id,
                    'code' => $this->coupon->code,
                    'name' => $this->coupon->name,
                ];
            }),

            // Metadata
            'canCancel' => $this->canCancel(),
            'canRefund' => $this->canRefund(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
