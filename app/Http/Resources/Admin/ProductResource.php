<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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

            // 기본 정보
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'barcode' => $this->barcode,

            // 가격 정보
            'price' => $this->price,
            'originalPrice' => $this->original_price,
            'costPrice' => $this->cost_price,

            // 분류
            'category_id' => $this->category_id,
            'brand' => $this->brand,

            // 상세 정보
            'description' => $this->description,
            'shortDescription' => $this->short_description,
            'ingredients' => $this->ingredients,
            'efficacy' => $this->efficacy,
            'usageInstructions' => $this->usage_instructions,
            'precautions' => $this->precautions,

            // 사양
            'volume' => $this->volume,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,

            // 특징 태그
            'features' => $this->features,
            'targetAudience' => $this->target_audience,

            // 평점 및 리뷰
            'rating' => $this->rating,
            'reviewCount' => $this->review_count,

            // 재고 관리
            'stock' => $this->stock,
            'lowStockThreshold' => $this->low_stock_threshold,
            'soldCount' => $this->sold_count,

            // 이미지
            'thumbnailUrl' => $this->thumbnail_url,
            'images' => $this->images,

            // 상태
            'isActive' => $this->is_active,
            'isFeatured' => $this->is_featured,
            'isNew' => $this->is_new,
            'isBestSeller' => $this->is_best_seller,

            // 의약외품 정보
            'isQuasiDrug' => $this->is_quasi_drug,
            'approvalNumber' => $this->approval_number,
            'manufacturer' => $this->manufacturer,
            'distributor' => $this->distributor,

            // SEO
            'metaTitle' => $this->meta_title,
            'metaDescription' => $this->meta_description,
            'metaKeywords' => $this->meta_keywords,

            // 타임스탬프
            'publishedAt' => $this->published_at?->format('Y-m-d H:i:s'),
            'createdAt' => $this->created_at?->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at?->format('Y-m-d H:i:s'),

            // Helper attributes
            'discountPercentage' => $this->getDiscountPercentage(),
            'isInStock' => $this->isInStock(),
            'isLowStock' => $this->isLowStock(),
        ];
    }
}
