<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // 기본 정보
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku', 100)->unique()->nullable()->comment('재고관리코드');
            $table->string('barcode', 50)->nullable()->comment('바코드');

            // 가격 정보
            $table->decimal('price', 10, 2)->comment('판매가');
            $table->decimal('original_price', 10, 2)->nullable()->comment('할인 전 가격');
            $table->decimal('cost_price', 10, 2)->nullable()->comment('원가');

            // 분류
            $table->string('category', 100);
            $table->string('brand', 100)->default('Dr.Smile');

            // 상세 정보
            $table->text('description')->nullable()->comment('상품 설명');
            $table->string('short_description', 500)->nullable()->comment('짧은 설명');
            $table->text('ingredients')->nullable()->comment('성분 정보');
            $table->text('efficacy')->nullable()->comment('효능');
            $table->text('usage_instructions')->nullable()->comment('사용 방법');
            $table->text('precautions')->nullable()->comment('주의사항');

            // 사양
            $table->string('volume', 50)->nullable()->comment('용량 (예: 100g)');
            $table->decimal('weight', 8, 2)->nullable()->comment('무게(g)');
            $table->json('dimensions')->nullable()->comment('크기 (가로x세로x높이)');

            // 특징 태그
            $table->json('features')->nullable()->comment('["미백", "잇몸케어", "민감치아"]');
            $table->json('target_audience')->nullable()->comment('["성인", "어린이", "노인"]');

            // 평점 및 리뷰
            $table->decimal('rating', 3, 2)->default(0)->comment('평균 평점');
            $table->integer('review_count')->default(0)->comment('리뷰 수');

            // 재고 관리
            $table->integer('stock')->default(0)->comment('재고 수량');
            $table->integer('low_stock_threshold')->default(10)->comment('재고 부족 기준');
            $table->integer('sold_count')->default(0)->comment('판매 수량');

            // 이미지
            $table->string('thumbnail_url', 500)->nullable()->comment('썸네일 이미지');
            $table->json('images')->nullable()->comment('상세 이미지 배열');

            // 상태
            $table->boolean('is_active')->default(true)->comment('판매 중');
            $table->boolean('is_featured')->default(false)->comment('추천 상품');
            $table->boolean('is_new')->default(false)->comment('신상품');
            $table->boolean('is_best_seller')->default(false)->comment('베스트셀러');

            // 의약외품 정보
            $table->boolean('is_quasi_drug')->default(false)->comment('의약외품 여부');
            $table->string('approval_number', 100)->nullable()->comment('의약외품 허가번호');
            $table->string('manufacturer', 255)->nullable()->comment('제조사');
            $table->string('distributor', 255)->nullable()->comment('판매원');

            // SEO
            $table->string('meta_title', 255)->nullable()->comment('SEO 제목');
            $table->text('meta_description')->nullable()->comment('SEO 설명');
            $table->string('meta_keywords', 500)->nullable()->comment('SEO 키워드');

            // 타임스탬프
            $table->timestamp('published_at')->nullable()->comment('판매 시작일');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete');

            // 인덱스
            $table->index('category');
            $table->index('rating');
            $table->index('price');
            $table->index('stock');
            $table->index('is_active');
            // Note: FULLTEXT index requires MySQL/MariaDB and should be added separately if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
