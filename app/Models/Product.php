<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        // 기본 정보
        'name',
        'slug',
        'sku',
        'barcode',

        // 가격 정보
        'price',
        'original_price',
        'cost_price',

        // 분류
        'category',
        'brand',

        // 상세 정보
        'description',
        'short_description',
        'ingredients',
        'efficacy',
        'usage_instructions',
        'precautions',

        // 사양
        'volume',
        'weight',
        'dimensions',

        // 특징 태그
        'features',
        'target_audience',
        'keywords',

        // 평점 및 리뷰
        'rating',
        'review_count',

        // 재고 관리
        'stock',
        'low_stock_threshold',
        'sold_count',

        // 이미지
        'thumbnail_url',
        'images',

        // 상태
        'is_active',
        'is_featured',
        'is_new',
        'is_best_seller',

        // 의약외품 정보
        'is_quasi_drug',
        'approval_number',
        'manufacturer',
        'distributor',

        // SEO
        'meta_title',
        'meta_description',
        'meta_keywords',

        // 타임스탬프
        'published_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'weight' => 'decimal:2',
        'review_count' => 'integer',
        'stock' => 'integer',
        'low_stock_threshold' => 'integer',
        'sold_count' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_quasi_drug' => 'boolean',
        'features' => 'array',
        'target_audience' => 'array',
        'keywords' => 'array',
        'images' => 'array',
        'dimensions' => 'array',
        'published_at' => 'datetime',
    ];

    /**
     * 카테고리 관계
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    /**
     * 리뷰 관계
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->orderBy('created_at', 'desc');
    }

    /**
     * 재고 변경 이력
     */
    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class)->orderBy('created_at', 'desc');
    }

    /**
     * 활성화된 상품만 조회
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * 추천 상품만 조회
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * 신상품만 조회
     */
    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    /**
     * 베스트셀러만 조회
     */
    public function scopeBestSeller($query)
    {
        return $query->where('is_best_seller', true);
    }

    /**
     * 재고 부족 상품만 조회
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'low_stock_threshold');
    }

    /**
     * 상품이 활성화되어 있는지 확인
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    /**
     * 재고가 있는지 확인
     */
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    /**
     * 재고가 부족한지 확인
     */
    public function isLowStock(): bool
    {
        return $this->stock <= $this->low_stock_threshold;
    }

    /**
     * 할인이 있는지 확인
     */
    public function hasDiscount(): bool
    {
        return $this->original_price !== null && $this->original_price > $this->price;
    }

    /**
     * 할인율 계산
     */
    public function getDiscountPercentage(): ?int
    {
        if (!$this->hasDiscount()) {
            return null;
        }

        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }
}
