<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 카테고리 조회 (존재하지 않으면 예외 발생)
        $categories = [
            '미백' => ProductCategory::where('slug', 'whitening')->firstOrFail()->id,
            '잇몸케어' => ProductCategory::where('slug', 'gum-care')->firstOrFail()->id,
            '민감치아' => ProductCategory::where('slug', 'sensitive')->firstOrFail()->id,
            '어린이' => ProductCategory::where('slug', 'kids')->firstOrFail()->id,
            '한방' => ProductCategory::where('slug', 'herbal')->firstOrFail()->id,
            '토탈케어' => ProductCategory::where('slug', 'total-care')->firstOrFail()->id,
        ];

        $products = [
            // 미백 치약
            [
                'name' => 'Dr.Smile 프리미엄 미백치약',
                'slug' => 'premium-whitening-toothpaste',
                'sku' => 'DSTP-001',
                'price' => 12900,
                'original_price' => 15900,
                'cost_price' => 5000,
                'category_id' => $categories['미백'],
                'brand' => 'Dr.Smile',
                'description' => '<h3>제품 상세정보</h3>
<p>Dr.Smile 프리미엄 미백치약은 20년 임상경험을 가진 치과의사가 직접 개발한 전문 미백 치약입니다. 일반 미백 치약과 달리 치아를 손상시키지 않으면서도 효과적으로 미백 효과를 제공합니다.</p>

<h4>주요 특징</h4>
<ul>
  <li>치과에서 사용하는 미백 성분 함유</li>
  <li>민감한 치아에도 자극 없이 사용 가능</li>
  <li>95% 천연 유래 성분으로 안전</li>
  <li>식약처 인증 의약외품</li>
  <li>대학병원 임상실험 완료</li>
</ul>

<h4>사용 대상</h4>
<ul>
  <li>커피, 차, 담배로 인한 치아 착색이 신경쓰이시는 분</li>
  <li>치아 미백을 원하지만 민감한 치아 때문에 망설이시는 분</li>
  <li>안전한 성분의 치약을 찾으시는 분</li>
  <li>전문가가 만든 프리미엄 치약을 원하시는 분</li>
</ul>',
                'short_description' => '치과의사가 개발한 천연 미백 치약',
                'ingredients' => '<h4>주요 성분</h4>
<ul>
  <li><strong>수산화인회석</strong> - 자연 미백 효과</li>
  <li><strong>질산칼륨</strong> - 시린이 완화</li>
  <li><strong>자일리톨</strong> - 충치 예방</li>
  <li><strong>프로폴리스 추출물</strong> - 잇몸 건강</li>
  <li><strong>알로에베라 추출물</strong> - 구강 진정</li>
</ul>

<h4>무첨가</h4>
<p>파라벤, 트리클로산, 인공색소, 합성향료, SLS, SLES 무첨가</p>',
                'efficacy' => '치아 미백, 충치 예방, 구취 제거',
                'usage_instructions' => '<ol>
  <li>칫솔에 적당량(완두콩 크기)을 짜줍니다.</li>
  <li>치아와 잇몸을 부드럽게 2-3분간 닦아줍니다.</li>
  <li>깨끗한 물로 충분히 헹궈냅니다.</li>
  <li>하루 3회, 식후 사용을 권장합니다.</li>
</ol>

<h4>치과의사 TIP</h4>
<p>미백 효과를 극대화하려면 칫솔질 후 30분간 음식물 섭취를 자제해주세요. 또한 색소가 강한 음식(커피, 홍차, 와인) 섭취 후에는 바로 양치하는 것이 좋습니다.</p>',
                'precautions' => '6세 이하 어린이는 보호자 지도 하에 사용하세요.',
                'volume' => '120g',
                'features' => ['대학병원 임상실험으로 검증된 미백 효과', '95% 천연 유래 성분, 유해물질 무첨가', '민감한 치아에도 자극 없이 사용 가능'],
                'keywords' => ['치과의사개발', '임상실험', '천연성분', '미백효과'],
                'target_audience' => ['성인'],
                'rating' => 4.7,
                'review_count' => 892,
                'stock' => 500,
                'sold_count' => 3421,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
                    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
                ],
                'is_active' => true,
                'is_best_seller' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0001호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],
            [
                'name' => 'Dr.Smile 화이트닝 파워 치약',
                'slug' => 'whitening-power-toothpaste',
                'sku' => 'DSTP-002',
                'price' => 14900,
                'original_price' => 17900,
                'cost_price' => 6000,
                'category_id' => $categories['미백'],
                'brand' => 'Dr.Smile',
                'description' => '<h3>제품 상세정보</h3>
<p>강력한 미백 효과로 누런 치아를 밝게 만들어주는 화이트닝 치약입니다. 커피, 차, 와인 등으로 착색된 치아를 집중 케어합니다.</p>

<h4>주요 특징</h4>
<ul>
  <li>치과 전문 미백 성분 고농도 함유</li>
  <li>착색 물질 집중 제거</li>
  <li>불소 함유로 충치 예방 효과</li>
  <li>상쾌한 민트향</li>
</ul>',
                'short_description' => '강력한 미백 파워로 밝은 미소',
                'ingredients' => '<h4>주요 성분</h4>
<ul>
  <li><strong>수산화인회석</strong> - 강력 미백</li>
  <li><strong>실리카</strong> - 착색 제거</li>
  <li><strong>불화나트륨</strong> - 충치 예방</li>
  <li><strong>페퍼민트 오일</strong> - 상쾌함</li>
</ul>

<h4>무첨가</h4>
<p>파라벤, 트리클로산 무첨가</p>',
                'efficacy' => '치아 미백, 얼룩 제거, 충치 예방',
                'usage_instructions' => '<ol>
  <li>칫솔에 적당량을 짜줍니다.</li>
  <li>치아를 2-3분간 꼼꼼히 닦아줍니다.</li>
  <li>물로 헹궈냅니다.</li>
  <li>하루 2-3회 사용을 권장합니다.</li>
</ol>',
                'volume' => '120g',
                'features' => ['강력한 미백 성분', '커피/와인 착색 집중 제거', '불소 함유로 충치 예방'],
                'keywords' => ['강력미백', '착색제거', '불소함유', '민트향'],
                'target_audience' => ['성인'],
                'rating' => 4.5,
                'review_count' => 543,
                'stock' => 300,
                'sold_count' => 1876,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1609840113674-5e9e3d2293ab?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1609840113674-5e9e3d2293ab?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_featured' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0002호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],

            // 잇몸케어 치약
            [
                'name' => 'Dr.Smile 잇몸케어 치약',
                'slug' => 'gum-care-toothpaste',
                'sku' => 'DSTP-003',
                'price' => 9900,
                'cost_price' => 4000,
                'category_id' => $categories['잇몸케어'],
                'brand' => 'Dr.Smile',
                'description' => '약해진 잇몸을 강화하고 잇몸 출혈을 예방하는 치약입니다. 한방 성분이 잇몸 건강을 지켜줍니다.',
                'short_description' => '건강한 잇몸 관리',
                'ingredients' => '정제수, 소르비톨, 실리카, 녹차추출물, 프로폴리스, 감초추출물',
                'efficacy' => '잇몸 출혈 예방, 잇몸 강화, 치석 제거',
                'usage_instructions' => '칫솔에 적당량을 묻혀 잇몸을 부드럽게 마사지하듯 닦아주세요.',
                'volume' => '120g',
                'features' => ['잇몸 출혈 완화', '한방 성분 함유', '치석 제거 효과'],
                'keywords' => ['잇몸케어', '출혈예방', '한방성분', '치석제거'],
                'target_audience' => ['성인', '노인'],
                'rating' => 4.6,
                'review_count' => 567,
                'stock' => 300,
                'sold_count' => 1987,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_best_seller' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0003호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],

            // 민감치아 치약
            [
                'name' => 'Dr.Smile 민감치아 치약',
                'slug' => 'sensitive-toothpaste',
                'sku' => 'DSTP-004',
                'price' => 11900,
                'cost_price' => 4500,
                'category_id' => $categories['민감치아'],
                'brand' => 'Dr.Smile',
                'description' => '시린 이를 완화하고 민감한 치아를 보호하는 전문 치약입니다. 무연마제 처방으로 치아를 보호합니다.',
                'short_description' => '시린 이 완화, 민감치아 보호',
                'ingredients' => '정제수, 소르비톨, 질산칼륨, 수산화인회석, 알로에베라',
                'efficacy' => '시린 이 완화, 치아 보호막 형성',
                'usage_instructions' => '칫솔에 적당량을 묻혀 부드럽게 닦아주세요. 하루 2-3회 사용 권장.',
                'volume' => '120g',
                'features' => ['시린 이 즉각 완화', '무연마제 저자극', '치아 보호막 형성'],
                'keywords' => ['민감치아', '시린이완화', '저자극', '무연마제'],
                'target_audience' => ['성인'],
                'rating' => 4.7,
                'review_count' => 432,
                'stock' => 250,
                'sold_count' => 1543,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_featured' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0004호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],

            // 어린이 치약
            [
                'name' => 'Dr.Smile 키즈 치약 (딸기향)',
                'slug' => 'kids-toothpaste-strawberry',
                'sku' => 'DSTP-005',
                'price' => 7900,
                'cost_price' => 3000,
                'category_id' => $categories['어린이'],
                'brand' => 'Dr.Smile',
                'description' => '불소 함유로 충치를 예방하고 아이들이 좋아하는 딸기향 치약입니다. 저불소 처방으로 안전합니다.',
                'short_description' => '딸기향 어린이 전용 치약',
                'ingredients' => '정제수, 소르비톨, 자일리톨, 불화나트륨(저불소), 딸기향료',
                'efficacy' => '충치 예방, 치아 강화',
                'usage_instructions' => '칫솔에 완두콩 크기만큼 짜서 사용하세요. 보호자 지도 하에 사용 권장.',
                'volume' => '80g',
                'features' => ['저불소 안전', '딸기향으로 재미있게', '충치 예방 효과'],
                'keywords' => ['어린이치약', '딸기향', '저불소', '충치예방'],
                'target_audience' => ['어린이'],
                'rating' => 4.8,
                'review_count' => 721,
                'stock' => 400,
                'sold_count' => 2876,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_best_seller' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0005호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],
            [
                'name' => 'Dr.Smile 키즈 치약 (포도향)',
                'slug' => 'kids-toothpaste-grape',
                'sku' => 'DSTP-006',
                'price' => 7900,
                'cost_price' => 3000,
                'category_id' => $categories['어린이'],
                'brand' => 'Dr.Smile',
                'description' => '아이들이 좋아하는 포도향으로 즐겁게 양치질할 수 있습니다. 저불소 처방으로 안전합니다.',
                'short_description' => '포도향 어린이 전용 치약',
                'ingredients' => '정제수, 소르비톨, 자일리톨, 불화나트륨(저불소), 포도향료',
                'efficacy' => '충치 예방, 치아 강화',
                'usage_instructions' => '칫솔에 완두콩 크기만큼 짜서 사용하세요. 보호자 지도 하에 사용 권장.',
                'volume' => '80g',
                'features' => ['저불소 안전', '포도향으로 재미있게', '충치 예방 효과'],
                'keywords' => ['어린이치약', '포도향', '저불소', '충치예방'],
                'target_audience' => ['어린이'],
                'rating' => 4.7,
                'review_count' => 489,
                'stock' => 350,
                'sold_count' => 1932,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0006호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],

            // 한방 치약
            [
                'name' => 'Dr.Smile 한방 치약',
                'slug' => 'herbal-toothpaste',
                'sku' => 'DSTP-007',
                'price' => 13900,
                'cost_price' => 5500,
                'category_id' => $categories['한방'],
                'brand' => 'Dr.Smile',
                'description' => '천연 한방 성분으로 만든 프리미엄 치약입니다. 녹차와 자작나무 추출물이 구강 건강을 지켜줍니다.',
                'short_description' => '천연 한방 성분으로 구강 건강',
                'ingredients' => '정제수, 소르비톨, 탄산칼슘, 실리카, 녹차추출물, 자작나무추출물, 감초추출물',
                'efficacy' => '구취 제거, 잇몸 강화, 치석 예방',
                'usage_instructions' => '칫솔에 적당량을 묻혀 3분간 닦아주세요. 하루 3회 사용 권장.',
                'volume' => '120g',
                'features' => ['천연 한방 성분', '구취 제거 효과', '잇몸 건강 케어'],
                'keywords' => ['한방', '천연성분', '녹차추출물', '구취제거'],
                'target_audience' => ['성인'],
                'rating' => 4.5,
                'review_count' => 378,
                'stock' => 220,
                'sold_count' => 1234,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0007호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],

            // 토탈케어 치약
            [
                'name' => 'Dr.Smile 토탈케어 치약',
                'slug' => 'total-care-toothpaste',
                'sku' => 'DSTP-008',
                'price' => 10900,
                'cost_price' => 4500,
                'category_id' => $categories['토탈케어'],
                'brand' => 'Dr.Smile',
                'description' => '미백, 잇몸케어, 충치예방을 한번에 해결하는 올인원 치약입니다. 바쁜 일상 속에서 완벽한 구강 관리를 원하는 분들에게 추천합니다.',
                'short_description' => '올인원 구강 케어',
                'ingredients' => '정제수, 소르비톨, 실리카, 수산화인회석, 질산칼륨, 불화나트륨',
                'efficacy' => '미백, 잇몸 케어, 충치 예방, 구취 제거',
                'usage_instructions' => '칫솔에 적당량을 묻혀 2-3분간 꼼꼼히 닦아주세요.',
                'volume' => '120g',
                'features' => ['미백+잇몸케어+충치예방 올인원', '하나로 완벽한 구강 관리', '가성비 최고의 토탈케어'],
                'keywords' => ['토탈케어', '올인원', '미백', '잇몸케어'],
                'target_audience' => ['성인'],
                'rating' => 4.6,
                'review_count' => 654,
                'stock' => 450,
                'sold_count' => 2543,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
                ],
                'is_active' => true,
                'is_featured' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0008호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],
            [
                'name' => 'Dr.Smile 프리미엄 토탈케어',
                'slug' => 'premium-total-care-toothpaste',
                'sku' => 'DSTP-009',
                'price' => 15900,
                'original_price' => 18900,
                'cost_price' => 6500,
                'category_id' => $categories['토탈케어'],
                'brand' => 'Dr.Smile',
                'description' => '프리미엄 성분으로 구강 건강을 완벽하게 지켜주는 최상급 치약입니다. 미백, 잇몸, 충치, 구취, 치석까지 5중 케어로 완벽한 구강 건강을 선사합니다.',
                'short_description' => '프리미엄 올인원 5중 케어',
                'ingredients' => '정제수, 소르비톨, 수산화인회석, 프로폴리스, 알로에베라, 자일리톨, 녹차추출물',
                'efficacy' => '미백, 잇몸 케어, 충치 예방, 구취 제거, 치석 예방',
                'usage_instructions' => '칫솔에 적당량을 묻혀 3분간 꼼꼼히 닦아주세요. 하루 3회 사용 권장.',
                'volume' => '120g',
                'features' => ['프리미엄 5중 케어', '천연 성분 함유', '치과 전문 처방'],
                'keywords' => ['프리미엄', '토탈케어', '5중케어', '천연성분'],
                'target_audience' => ['성인'],
                'rating' => 4.8,
                'review_count' => 432,
                'stock' => 200,
                'sold_count' => 1567,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1609840113674-5e9e3d2293ab?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1609840113674-5e9e3d2293ab?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_featured' => true,
                'is_new' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0009호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],

            // 기타 토탈케어
            [
                'name' => 'Dr.Smile 센시티브 토탈케어',
                'slug' => 'sensitive-total-care-toothpaste',
                'sku' => 'DSTP-010',
                'price' => 12900,
                'cost_price' => 5200,
                'category_id' => $categories['토탈케어'],
                'brand' => 'Dr.Smile',
                'description' => '민감한 치아를 위한 저자극 토탈케어 치약입니다. 시린 이를 완화하면서 미백, 잇몸케어, 충치예방까지 모두 관리합니다.',
                'short_description' => '민감치아용 토탈케어',
                'ingredients' => '정제수, 소르비톨, 질산칼륨, 수산화인회석, 알로에베라',
                'efficacy' => '시린 이 완화, 미백, 잇몸 케어, 충치 예방',
                'usage_instructions' => '칫솔에 적당량을 묻혀 부드럽게 2-3분간 닦아주세요.',
                'volume' => '120g',
                'features' => ['민감치아 특화', '저자극 토탈케어', '시린 이 완화'],
                'keywords' => ['민감치아', '토탈케어', '저자극', '시린이완화'],
                'target_audience' => ['성인'],
                'rating' => 4.6,
                'review_count' => 298,
                'stock' => 180,
                'sold_count' => 987,
                'thumbnail_url' => 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
                    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
                ],
                'is_active' => true,
                'is_quasi_drug' => true,
                'approval_number' => '제2024-0010호',
                'manufacturer' => 'Dr.Smile 제약',
                'distributor' => 'Dr.Smile Corp.',
                'published_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
