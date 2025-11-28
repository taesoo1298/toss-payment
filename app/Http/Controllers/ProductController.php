<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * 상품 목록 페이지 (필터링, 정렬, 페이지네이션)
     */
    public function index(Request $request): Response
    {
        $query = Product::query()->active();

        // 카테고리 필터
        if ($request->filled('category') && $request->category !== 'all') {
            $categorySlugMap = [
                'whitening' => 'whitening',
                'gum' => 'gum-care',
                'sensitive' => 'sensitive',
                'kids' => 'kids',
                'herbal' => 'herbal',
                'total' => 'total-care',
            ];

            $slug = $categorySlugMap[$request->category] ?? null;
            if ($slug) {
                $query->whereHas('category', function ($q) use ($slug) {
                    $q->where('slug', $slug);
                });
            }
        }

        // 가격 범위 필터
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // 특징 필터 (features)
        if ($request->filled('features')) {
            $features = is_array($request->features) ? $request->features : [$request->features];
            foreach ($features as $feature) {
                $query->whereJsonContains('features', $feature);
            }
        }

        // 평점 필터
        if ($request->filled('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        // 정렬
        $sort = $request->get('sort', 'popular');
        switch ($sort) {
            case 'recent':
                $query->orderBy('created_at', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'popular':
            default:
                $query->orderBy('sold_count', 'desc');
                break;
        }

        // 페이지네이션
        $products = $query->paginate(12)->through(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->short_description ?? $product->description,
                'price' => (float) $product->price,
                'originalPrice' => $product->original_price ? (float) $product->original_price : null,
                'image' => $product->thumbnail_url,
                'category' => $product->category->name ?? '전체상품',
                'badge' => $product->is_best_seller ? 'BEST' : ($product->is_new ? 'NEW' : null),
                'rating' => (float) $product->rating,
                'reviewCount' => $product->review_count,
                'features' => $product->features,
            ];
        });

        return Inertia::render('Products/ProductList', [
            'category' => $request->get('category', 'all'),
            'products' => $products,
            'filters' => [
                'price_min' => $request->price_min,
                'price_max' => $request->price_max,
                'features' => $request->features,
                'rating' => $request->rating,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * 상품 상세 페이지
     */
    public function show(string $id): Response
    {
        $product = Product::with(['category', 'reviews' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(20);
        }, 'reviews.user'])->findOrFail($id);

        // 관련 상품 (같은 카테고리, 최대 4개)
        $relatedProducts = Product::query()
            ->active()
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->short_description ?? $item->description,
                    'price' => (float) $item->price,
                    'originalPrice' => $item->original_price ? (float) $item->original_price : null,
                    'image' => $item->thumbnail_url,
                    'category' => $item->category->name ?? '',
                    'rating' => (float) $item->rating,
                    'reviewCount' => $item->review_count,
                ];
            });

        // 리뷰 데이터
        $reviews = $product->reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'userName' => $review->user ? substr($review->user->name, 0, 1) . '*' . substr($review->user->name, -1) : '익명',
                'rating' => $review->rating,
                'date' => $review->created_at->format('Y-m-d'),
                'content' => $review->content,
                'images' => $review->images ?? [],
                'verified' => $review->is_verified,
            ];
        });

        // 설정 데이터 (배송/반품 정책, 포인트)
        $settings = \App\Models\Setting::whereIn('key', [
            'shipping_policy',
            'return_policy',
            'exchange_policy',
            'shipping_cost',
            'free_shipping_threshold',
            'point_rate',
        ])->pluck('value', 'key');

        return Inertia::render('ProductDetail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'price' => (float) $product->price,
                'originalPrice' => $product->original_price ? (float) $product->original_price : null,
                'image' => $product->thumbnail_url,
                'images' => $product->images ?? [],
                'category' => $product->category->name ?? '전체상품',
                'badge' => $product->is_best_seller ? 'BEST' : ($product->is_new ? 'NEW' : null),
                'rating' => (float) $product->rating,
                'reviewCount' => $product->review_count,
                'features' => $product->features,
                'keywords' => $product->keywords ?? [],
                'stock' => $product->stock,
                'volume' => $product->volume,
                'ingredients' => $product->ingredients,
                'efficacy' => $product->efficacy,
                'usage_instructions' => $product->usage_instructions,
                'precautions' => $product->precautions,
            ],
            'relatedProducts' => $relatedProducts,
            'reviews' => $reviews,
            'settings' => [
                'shippingPolicy' => $settings['shipping_policy'] ?? '배송 정책 정보가 없습니다.',
                'returnPolicy' => $settings['return_policy'] ?? '반품 정책 정보가 없습니다.',
                'exchangePolicy' => $settings['exchange_policy'] ?? '교환 정책 정보가 없습니다.',
                'shippingCost' => (int) ($settings['shipping_cost'] ?? 3000),
                'freeShippingThreshold' => (int) ($settings['free_shipping_threshold'] ?? 50000),
                'pointRate' => (float) ($settings['point_rate'] ?? 1),
            ],
        ]);
    }
}
