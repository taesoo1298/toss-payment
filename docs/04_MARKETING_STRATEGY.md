# 마케팅 및 SEO 전략

## 1. 검색엔진 최적화 (SEO)

### 1.1 SEO 기본 전략

#### 1.1.1 타겟 키워드 분석

| 키워드          | 월간 검색량 | 경쟁도 | 우선순위 |
| --------------- | ----------- | ------ | -------- |
| 전동칫솔        | 74,000      | 높음   | ⭐⭐⭐   |
| 전동칫솔 추천   | 33,000      | 높음   | ⭐⭐⭐   |
| 칫솔 추천       | 18,000      | 중간   | ⭐⭐     |
| 치실 사용법     | 4,400       | 낮음   | ⭐⭐⭐   |
| 구강청결제 추천 | 2,900       | 낮음   | ⭐⭐⭐   |
| 치간칫솔        | 2,400       | 낮음   | ⭐⭐     |
| 미백치약 추천   | 1,600       | 중간   | ⭐⭐     |

**전략**:

-   초기: 낮은 경쟁도 키워드 집중 (치실, 구강청결제, 치간칫솔)
-   중기: 중간 경쟁도 키워드 확대 (미백치약, 칫솔 추천)
-   장기: 높은 경쟁도 키워드 도전 (전동칫솔)

### 1.2 메타 태그 최적화

#### 1.2.1 Inertia.js Head 설정

```tsx
// resources/js/Pages/Product/Show.tsx
import { Head } from "@inertiajs/react";

export default function ProductShow({ product }) {
    const pageTitle = `${product.name} | Dr.Smile`;
    const description =
        product.shortDescription ||
        `${product.name} - ${product.brand}. ${product.category.name} 전문몰 Dr.Smile에서 최저가로 만나보세요.`;
    const ogImage =
        product.thumbnailImage?.url || "/images/default-og-image.jpg";

    return (
        <>
            <Head>
                {/* Basic Meta Tags */}
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content={`${product.name}, ${product.brand}, ${product.category.name}, 구강용품`}
                />

                {/* Open Graph (Facebook, LinkedIn) */}
                <meta property="og:type" content="product" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImage} />
                <meta
                    property="og:url"
                    content={route("products.show", product.slug)}
                />
                <meta property="og:site_name" content="Dr.Smile" />

                {/* Product-specific OG tags */}
                <meta property="product:price:amount" content={product.price} />
                <meta property="product:price:currency" content="KRW" />
                <meta
                    property="product:availability"
                    content={
                        product.stockQuantity > 0 ? "in stock" : "out of stock"
                    }
                />
                <meta property="product:brand" content={product.brand} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href={route("products.show", product.slug)}
                />
            </Head>

            {/* Product Content */}
        </>
    );
}
```

#### 1.2.2 카테고리 페이지 SEO

```tsx
// resources/js/Pages/Category/Show.tsx
export default function CategoryShow({ category, products }) {
    return (
        <Head>
            <title>{category.name} | Dr.Smile</title>
            <meta
                name="description"
                content={`${category.name} 카테고리의 다양한 제품을 만나보세요. ${category.description}`}
            />
            <meta
                name="keywords"
                content={`${category.name}, 구강용품, 치아관리`}
            />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${category.name} | Dr.Smile`} />
            <meta property="og:description" content={category.description} />
            <meta
                property="og:image"
                content={category.imageUrl || "/images/default-category.jpg"}
            />

            <link
                rel="canonical"
                href={route("categories.show", category.slug)}
            />
        </Head>
    );
}
```

### 1.3 구조화된 데이터 (JSON-LD)

#### 1.3.1 상품 스키마

```tsx
// resources/js/Components/StructuredData/ProductSchema.tsx
export function ProductSchema({ product }) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.images.map((img) => img.url),
        description: product.description,
        sku: product.sku,
        brand: {
            "@type": "Brand",
            name: product.brand,
        },
        offers: {
            "@type": "Offer",
            url: route("products.show", product.slug),
            priceCurrency: "KRW",
            price: product.price,
            availability:
                product.stockQuantity > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "Dr.Smile",
            },
        },
        aggregateRating:
            product.reviews.length > 0
                ? {
                      "@type": "AggregateRating",
                      ratingValue: product.averageRating,
                      reviewCount: product.reviewCount,
                  }
                : undefined,
        review: product.reviews.map((review) => ({
            "@type": "Review",
            author: {
                "@type": "Person",
                name: review.author.name,
            },
            datePublished: review.createdAt,
            reviewBody: review.content,
            reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
```

#### 1.3.2 빵 부스러기 스키마

```tsx
// resources/js/Components/StructuredData/BreadcrumbSchema.tsx
export function BreadcrumbSchema({ items }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// 사용 예시
<BreadcrumbSchema
    items={[
        { name: "홈", url: route("home") },
        {
            name: "전동칫솔",
            url: route("categories.show", "electric-toothbrush"),
        },
        { name: product.name, url: route("products.show", product.slug) },
    ]}
/>;
```

### 1.4 사이트맵 생성

```php
// app/Console/Commands/GenerateSitemap.php
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // 홈페이지
        $sitemap->add(
            Url::create(route('home'))
                ->setPriority(1.0)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
        );

        // 카테고리 페이지
        Category::active()->get()->each(function ($category) use ($sitemap) {
            $sitemap->add(
                Url::create(route('categories.show', $category->slug))
                    ->setLastModificationDate($category->updated_at)
                    ->setPriority(0.8)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            );
        });

        // 상품 페이지
        Product::active()->get()->each(function ($product) use ($sitemap) {
            $sitemap->add(
                Url::create(route('products.show', $product->slug))
                    ->setLastModificationDate($product->updated_at)
                    ->setPriority(0.6)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            );
        });

        // 블로그 포스트
        Post::published()->get()->each(function ($post) use ($sitemap) {
            $sitemap->add(
                Url::create(route('blog.show', $post->slug))
                    ->setLastModificationDate($post->updated_at)
                    ->setPriority(0.5)
            );
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully!');
    }
}
```

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // 매일 새벽 3시에 사이트맵 재생성
    $schedule->command('sitemap:generate')->dailyAt('03:00');
}
```

### 1.5 robots.txt 설정

```
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /my-account/

# Sitemap
Sitemap: https://drsmile.com/sitemap.xml

# 크롤링 속도 제한
Crawl-delay: 1
```

### 1.6 페이지 속도 최적화

#### 1.6.1 이미지 최적화

```tsx
// resources/js/Components/OptimizedImage.tsx
export function OptimizedImage({ src, alt, width, height, className }) {
    // CloudFront에서 WebP 변환 및 리사이징
    const optimizedSrc = `${src}?format=webp&width=${width}`;
    const fallbackSrc = src;

    return (
        <picture>
            <source srcSet={optimizedSrc} type="image/webp" />
            <img
                src={fallbackSrc}
                alt={alt}
                width={width}
                height={height}
                className={className}
                loading="lazy"
                decoding="async"
            />
        </picture>
    );
}
```

#### 1.6.2 코드 스플리팅

```typescript
// resources/js/app.tsx
import { lazy } from "react";

// 라우트별 코드 스플리팅
const pages = {
    Home: lazy(() => import("./Pages/Home")),
    "Product/Show": lazy(() => import("./Pages/Product/Show")),
    "Category/Show": lazy(() => import("./Pages/Category/Show")),
    Checkout: lazy(() => import("./Pages/Checkout")),
};
```

### 1.7 내부 링크 구조

```tsx
// resources/js/Components/RelatedProducts.tsx
export function RelatedProducts({ products }) {
    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">관련 상품</h2>
            <div className="grid grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={route("products.show", product.slug)}
                        className="group"
                    >
                        <OptimizedImage
                            src={product.thumbnailImage.url}
                            alt={product.name}
                            width={300}
                            height={300}
                        />
                        <h3 className="mt-2 group-hover:text-blue-600">
                            {product.name}
                        </h3>
                        <p className="font-bold">
                            {formatPrice(product.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
```

## 2. 콘텐츠 마케팅

### 2.1 블로그 운영

#### 2.1.1 블로그 주제 전략

**카테고리별 콘텐츠 계획**:

1. **제품 가이드** (주 1회)

    - "전동칫솔 고르는 방법 완벽 가이드"
    - "칫솔모 종류와 선택 기준"
    - "치실 vs 치간칫솔, 무엇을 사용해야 할까?"

2. **구강 건강 팁** (주 2회)

    - "올바른 양치질 방법 7단계"
    - "잇몸 건강을 위한 생활 습관"
    - "치아 미백, 집에서 안전하게 하는 방법"

3. **제품 리뷰** (주 1회)

    - "2025년 전동칫솔 TOP 5 비교"
    - "가성비 좋은 치약 추천 10선"
    - "구강청결제 효과 있을까? 실험 결과"

4. **인터뷰 & 전문가 칼럼** (월 2회)
    - "치과의사가 알려주는 구강 관리 비법"
    - "치위생사의 칫솔 선택 노하우"

#### 2.1.2 블로그 데이터베이스

```sql
CREATE TABLE posts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,

    -- 콘텐츠
    excerpt TEXT COMMENT '발췌문',
    content LONGTEXT NOT NULL,

    -- SEO
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    featured_image VARCHAR(255),

    -- 분류
    category_id BIGINT UNSIGNED,
    tags JSON,

    -- 관련 상품
    related_products JSON COMMENT '연관 상품 ID 목록',

    -- 상태
    status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
    published_at TIMESTAMP NULL,

    -- 통계
    view_count INT DEFAULT 0,

    -- 작성자
    author_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (author_id) REFERENCES admins(id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
);
```

#### 2.1.3 블로그 페이지 컴포넌트

```tsx
// resources/js/Pages/Blog/Show.tsx
export default function BlogShow({ post, relatedPosts, relatedProducts }) {
    return (
        <>
            <Head>
                <title>{post.metaTitle || post.title}</title>
                <meta
                    name="description"
                    content={post.metaDescription || post.excerpt}
                />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={post.title} />
                <meta property="og:image" content={post.featuredImage} />
                <meta
                    property="article:published_time"
                    content={post.publishedAt}
                />
                <meta property="article:author" content={post.author.name} />
            </Head>

            <article className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center text-gray-600">
                        <span>{post.author.name}</span>
                        <span className="mx-2">·</span>
                        <time>{formatDate(post.publishedAt)}</time>
                        <span className="mx-2">·</span>
                        <span>{post.viewCount} views</span>
                    </div>
                </header>

                {post.featuredImage && (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full rounded-lg mb-8"
                    />
                )}

                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* 관련 상품 */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12 p-6 bg-gray-50 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">
                            이 글과 관련된 상품
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {relatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 관련 글 */}
                {relatedPosts.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold mb-4">관련 글</h2>
                        <div className="space-y-4">
                            {relatedPosts.map((relatedPost) => (
                                <PostCard
                                    key={relatedPost.id}
                                    post={relatedPost}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}
```

### 2.2 소셜 미디어 마케팅

#### 2.2.1 채널별 전략

| 채널              | 주요 타겟    | 콘텐츠 유형           | 게시 빈도 |
| ----------------- | ------------ | --------------------- | --------- |
| **인스타그램**    | 20-30대 여성 | 제품 이미지, 리뷰, 팁 | 주 3회    |
| **네이버 블로그** | 30-50대      | 상세 리뷰, 가이드     | 주 2회    |
| **유튜브**        | 전 연령대    | 사용법, 비교 리뷰     | 월 2회    |
| **카카오톡 채널** | 기존 고객    | 프로모션, 신제품      | 주 1회    |

#### 2.2.2 인스타그램 콘텐츠 계획

**콘텐츠 믹스 (주간)**:

-   월: 제품 소개 (Feed)
-   화: 사용 팁 (Reels)
-   수: 고객 리뷰 (Story)
-   목: 이벤트/프로모션 (Feed)
-   금: 구강 건강 팁 (Carousel)

### 2.3 이메일 마케팅

#### 2.3.1 자동화 이메일 시나리오

1. **웰컴 시리즈** (회원가입 후)

    - Day 0: 가입 감사 + 10% 할인 쿠폰
    - Day 3: 인기 제품 추천
    - Day 7: 구강 관리 팁 + 블로그 링크

2. **장바구니 이탈**

    - 1시간 후: "장바구니에 담긴 상품을 확인하세요"
    - 24시간 후: "놓치기 전에! 5% 추가 할인"
    - 3일 후: 마지막 리마인더

3. **구매 후**
    - 배송 완료 후: 리뷰 작성 요청 (포인트 제공)
    - 30일 후: 재구매 추천 (소모품)
    - 90일 후: 보관 및 관리 팁

#### 2.3.2 이메일 템플릿

```blade
{{-- resources/views/emails/welcome.blade.php --}}
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: white;">Dr.Smile에 오신 것을 환영합니다!</h1>
    </div>

    <div style="padding: 30px;">
        <p>안녕하세요, {{ $user->name }}님!</p>

        <p>Dr.Smile 회원이 되신 것을 진심으로 환영합니다.
        건강한 치아와 밝은 미소를 위한 여정을 함께 하겠습니다.</p>

        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">🎁 첫 구매 10% 할인 쿠폰</h2>
            <p>쿠폰 코드: <strong>WELCOME10</strong></p>
            <p>유효기간: 가입일로부터 7일</p>
            <a href="{{ route('products.index') }}"
               style="display: inline-block; background: #4F46E5; color: white;
                      padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                쇼핑하러 가기
            </a>
        </div>

        <h3>인기 상품 TOP 3</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            @foreach($popularProducts as $product)
            <div>
                <img src="{{ $product->thumbnail_url }}"
                     alt="{{ $product->name }}"
                     style="width: 100%; border-radius: 8px;">
                <p style="font-size: 14px; margin: 5px 0;">{{ $product->name }}</p>
                <p style="font-weight: bold;">{{ number_format($product->price) }}원</p>
            </div>
            @endforeach
        </div>
    </div>

    <div style="background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px;">
        <p>Dr.Smile | 서울시 강남구 테헤란로 123</p>
        <p>
            <a href="{{ route('unsubscribe') }}">수신거부</a> |
            <a href="{{ route('privacy') }}">개인정보처리방침</a>
        </p>
    </div>
</body>
</html>
```

## 3. 초기 프로모션 전략

### 3.1 오픈 프로모션

#### 3.1.1 그랜드 오픈 이벤트

**기간**: 오픈일로부터 2주
**목표**: 초기 인지도 확보, 회원 유치

**프로모션 내용**:

1. **전 회원 20% 할인**
    - 쿠폰 코드: `GRANDOPEN20`
    - 최대 할인액: 10,000원
2. **신규 가입 혜택**
    - 즉시 사용 가능한 5,000원 쿠폰
    - 친구 추천 시 양쪽 모두 3,000원 적립금
3. **무료배송 이벤트**

    - 오픈 기간 중 전 상품 무료배송 (도서산간 제외)

4. **럭키박스 증정**
    - 5만원 이상 구매 시 샘플 5종 세트 증정

### 3.2 시즌별 프로모션

#### 3.2.1 연간 프로모션 캘린더

| 시기     | 이벤트         | 프로모션 내용                       |
| -------- | -------------- | ----------------------------------- |
| **1월**  | 새해 맞이      | 칫솔 교체 캠페인 (구매 시 10% 할인) |
| **2월**  | 발렌타인데이   | 커플 세트 특가                      |
| **3월**  | 새 학기        | 어린이 구강용품 세트 할인           |
| **6월**  | 구강 보건의 날 | 전동칫솔 최대 30% 할인              |
| **9월**  | 추석 선물      | 선물세트 기획전                     |
| **11월** | 블랙프라이데이 | 전 상품 최대 50% 할인               |
| **12월** | 연말 정산      | 구매금액 10% 적립금 환급            |

### 3.3 할인 쿠폰 시스템

#### 3.3.1 Coupons 테이블

```sql
CREATE TABLE coupons (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,

    -- 할인 유형
    discount_type ENUM('fixed', 'percentage') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2) NULL COMMENT '최대 할인 금액',

    -- 사용 조건
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '최소 구매 금액',
    applicable_categories JSON COMMENT '적용 카테고리',
    applicable_products JSON COMMENT '적용 상품',

    -- 사용 제한
    usage_limit INT NULL COMMENT '전체 사용 횟수 제한',
    usage_limit_per_user INT DEFAULT 1 COMMENT '회원당 사용 횟수',

    -- 유효 기간
    valid_from TIMESTAMP NULL,
    valid_until TIMESTAMP NULL,

    -- 상태
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_valid_dates (valid_from, valid_until)
);

CREATE TABLE coupon_usages (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    coupon_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,

    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP NOT NULL,

    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_user_id (user_id)
);
```

#### 3.3.2 쿠폰 적용 로직

```php
// app/Services/CouponService.php
class CouponService
{
    public function applyCoupon(string $code, Cart $cart, User $user): array
    {
        $coupon = Coupon::where('code', $code)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('valid_from')
                    ->orWhere('valid_from', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('valid_until')
                    ->orWhere('valid_until', '>=', now());
            })
            ->firstOrFail();

        // 최소 구매 금액 체크
        if ($cart->subtotal < $coupon->min_purchase_amount) {
            throw new \Exception("최소 구매 금액은 {$coupon->min_purchase_amount}원 입니다.");
        }

        // 사용 횟수 체크
        $usageCount = CouponUsage::where('coupon_id', $coupon->id)
            ->where('user_id', $user->id)
            ->count();

        if ($usageCount >= $coupon->usage_limit_per_user) {
            throw new \Exception('쿠폰 사용 횟수를 초과했습니다.');
        }

        // 할인 금액 계산
        $discountAmount = $this->calculateDiscount($coupon, $cart);

        return [
            'coupon' => $coupon,
            'discount_amount' => $discountAmount,
        ];
    }

    private function calculateDiscount(Coupon $coupon, Cart $cart): float
    {
        if ($coupon->discount_type === 'fixed') {
            return min($coupon->discount_value, $cart->subtotal);
        }

        // percentage
        $discount = $cart->subtotal * ($coupon->discount_value / 100);

        if ($coupon->max_discount_amount) {
            $discount = min($discount, $coupon->max_discount_amount);
        }

        return $discount;
    }
}
```

## 4. 리뷰 관리 시스템

### 4.1 리뷰 테이블

```sql
CREATE TABLE product_reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,

    -- 평점 및 내용
    rating INT NOT NULL COMMENT '1-5',
    title VARCHAR(100),
    content TEXT NOT NULL,

    -- 이미지
    images JSON,

    -- 상태
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_at TIMESTAMP NULL,

    -- 도움이 되었나요?
    helpful_count INT DEFAULT 0,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_review (product_id, user_id, order_id)
);
```

### 4.2 리뷰 인센티브

```php
// 리뷰 작성 시 포인트 지급
event(new ReviewCreated($review));

// app/Listeners/RewardReviewPoints.php
class RewardReviewPoints
{
    public function handle(ReviewCreated $event)
    {
        $review = $event->review;
        $user = $review->user;

        $points = 500; // 기본 포인트

        // 사진 리뷰인 경우 추가 포인트
        if (!empty($review->images)) {
            $points += 500;
        }

        $user->points()->create([
            'amount' => $points,
            'reason' => '상품 리뷰 작성',
            'expires_at' => now()->addYear(),
        ]);
    }
}
```

## 5. 구현 체크리스트

### Phase 1: SEO 기본 설정

-   [ ] 메타 태그 최적화
-   [ ] 구조화된 데이터 (JSON-LD)
-   [ ] 사이트맵 생성 자동화
-   [ ] robots.txt 설정
-   [ ] 페이지 속도 최적화

### Phase 2: 콘텐츠 마케팅

-   [ ] 블로그 시스템 구축
-   [ ] 초기 10개 글 작성
-   [ ] 소셜 미디어 계정 개설
-   [ ] 이메일 마케팅 자동화

### Phase 3: 프로모션

-   [ ] 쿠폰 시스템 구현
-   [ ] 오픈 프로모션 기획
-   [ ] 시즌별 이벤트 캘린더
-   [ ] 리뷰 관리 시스템

### Phase 4: 분석 및 최적화

-   [ ] Google Analytics 연동
-   [ ] Google Search Console 등록
-   [ ] 키워드 순위 모니터링
-   [ ] 전환율 최적화 (CRO)

---

**최종 업데이트**: 2025-11-20
**담당자**: Marketing Team
**상태**: Planning
