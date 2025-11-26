<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    /**
     * Disable data wrapping
     */
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'discountType' => $this->discount_type,
            'discountValue' => (float) $this->discount_value,
            'minPurchaseAmount' => (float) $this->min_purchase_amount,
            'maxDiscountAmount' => $this->max_discount_amount ? (float) $this->max_discount_amount : null,
            'applicableCategories' => $this->applicable_categories ?? [],
            'usageLimit' => $this->usage_limit,
            'usageCount' => $this->usage_count,
            'validFrom' => $this->valid_from?->toISOString(),
            'validUntil' => $this->valid_until?->toISOString(),
            'isActive' => $this->is_active,
            'status' => $this->status,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
