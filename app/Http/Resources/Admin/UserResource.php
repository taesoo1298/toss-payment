<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'emailVerifiedAt' => $this->email_verified_at?->toISOString(),
            'provider' => $this->provider,
            'avatar' => $this->avatar,
            'isAdmin' => $this->is_admin,

            // Statistics
            'ordersCount' => $this->when(
                $this->relationLoaded('orders'),
                fn() => $this->orders->count()
            ),
            'totalSpent' => $this->when(
                $this->relationLoaded('orders'),
                fn() => $this->orders->where('status', '!=', 'cancelled')->sum('total_amount')
            ),

            // Relations
            'orders' => OrderResource::collection($this->whenLoaded('orders')),

            // Timestamps
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
