<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => '전체상품',
                'slug' => 'all',
                'description' => '모든 Dr.Smile 제품을 확인하세요',
                'sort_order' => 1,
            ],
            [
                'name' => '미백케어',
                'slug' => 'whitening',
                'description' => '밝고 환한 미소를 위한 미백 치약',
                'sort_order' => 2,
            ],
            [
                'name' => '잇몸케어',
                'slug' => 'gum-care',
                'description' => '건강한 잇몸을 위한 전문 치약',
                'sort_order' => 3,
            ],
            [
                'name' => '민감치아',
                'slug' => 'sensitive',
                'description' => '시린 이를 위한 부드러운 케어',
                'sort_order' => 4,
            ],
            [
                'name' => '어린이용',
                'slug' => 'kids',
                'description' => '아이들을 위한 안전한 치약',
                'sort_order' => 5,
            ],
            [
                'name' => '한방치약',
                'slug' => 'herbal',
                'description' => '천연 한방 성분으로 만든 치약',
                'sort_order' => 6,
            ],
            [
                'name' => '토탈케어',
                'slug' => 'total-care',
                'description' => '올인원 종합 구강 케어',
                'sort_order' => 7,
            ],
            [
                'name' => '선물세트',
                'slug' => 'gift-sets',
                'description' => '소중한 분께 선물하기 좋은 세트',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            ProductCategory::create($category);
        }
    }
}
