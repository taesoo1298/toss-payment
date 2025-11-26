<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'productId' => $this->product_id,
            'userId' => $this->user_id,
            'orderItemId' => $this->order_item_id,
            'rating' => $this->rating,
            'content' => $this->content,
            'images' => $this->images ?? [],
            'isVerified' => $this->is_verified,

            // Relations
            'product' => $this->when($this->relationLoaded('product'), function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'thumbnailUrl' => $this->product->thumbnail_url,
                ];
            }),
            'user' => $this->when($this->relationLoaded('user'), function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'maskedName' => $this->masked_user_name,
                    'email' => $this->user->email,
                ];
            }),

            // Timestamps
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
