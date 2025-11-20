<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 기본 정보
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'barcode' => ['nullable', 'string', 'max:50'],

            // 가격 정보
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99', 'gte:price'],
            'cost_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],

            // 분류
            'category' => ['required', 'string'],
            'brand' => ['nullable', 'string', 'max:100'],

            // 상세 정보
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'ingredients' => ['nullable', 'string'],
            'efficacy' => ['nullable', 'string'],
            'usage_instructions' => ['nullable', 'string'],
            'precautions' => ['nullable', 'string'],

            // 사양
            'volume' => ['nullable', 'string', 'max:50'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'array'],
            'dimensions.width' => ['nullable', 'numeric'],
            'dimensions.height' => ['nullable', 'numeric'],
            'dimensions.depth' => ['nullable', 'numeric'],

            // 특징 태그
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'target_audience' => ['nullable', 'array'],
            'target_audience.*' => ['string'],

            // 재고 관리
            'stock' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],

            // 이미지
            'thumbnail' => ['nullable', 'image', 'max:2048'], // 2MB
            'product_images' => ['nullable', 'array', 'max:10'],
            'product_images.*' => ['image', 'max:5120'], // 5MB

            // 상태
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_new' => ['boolean'],
            'is_best_seller' => ['boolean'],

            // 의약외품 정보
            'is_quasi_drug' => ['boolean'],
            'approval_number' => ['nullable', 'string', 'max:100'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'distributor' => ['nullable', 'string', 'max:255'],

            // SEO
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'string', 'max:500'],

            // 타임스탬프
            'published_at' => ['nullable', 'date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => '상품명을 입력해주세요.',
            'name.max' => '상품명은 255자를 초과할 수 없습니다.',
            'sku.unique' => '이미 사용 중인 SKU입니다.',
            'price.required' => '판매가를 입력해주세요.',
            'price.numeric' => '가격은 숫자만 입력 가능합니다.',
            'price.min' => '가격은 0원 이상이어야 합니다.',
            'original_price.gte' => '정가는 판매가보다 크거나 같아야 합니다.',
            'category.required' => '카테고리를 선택해주세요.',
            'stock.required' => '재고 수량을 입력해주세요.',
            'stock.integer' => '재고 수량은 정수만 입력 가능합니다.',
            'short_description.max' => '짧은 설명은 500자를 초과할 수 없습니다.',
            'thumbnail.image' => '썸네일은 이미지 파일만 가능합니다.',
            'thumbnail.max' => '썸네일 이미지는 2MB를 초과할 수 없습니다.',
            'product_images.max' => '상품 이미지는 최대 10개까지 업로드 가능합니다.',
            'product_images.*.image' => '이미지 파일만 업로드 가능합니다.',
            'product_images.*.max' => '각 이미지는 5MB를 초과할 수 없습니다.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => '상품명',
            'sku' => 'SKU',
            'barcode' => '바코드',
            'price' => '판매가',
            'original_price' => '정가',
            'cost_price' => '원가',
            'category' => '카테고리',
            'brand' => '브랜드',
            'description' => '상품 설명',
            'short_description' => '짧은 설명',
            'ingredients' => '성분 정보',
            'efficacy' => '효능',
            'usage_instructions' => '사용 방법',
            'precautions' => '주의사항',
            'volume' => '용량',
            'weight' => '무게',
            'features' => '제품 특징',
            'target_audience' => '대상 고객',
            'stock' => '재고',
            'low_stock_threshold' => '재고 부족 기준',
            'thumbnail' => '썸네일 이미지',
            'product_images' => '상품 이미지',
        ];
    }
}
