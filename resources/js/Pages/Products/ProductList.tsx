import { Head, Link, router } from "@inertiajs/react";
import { PageProps, Product } from "@/types";
import Header from "@/Components/Header";
import ProductCard from "@/Components/ProductCard";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import {
    ChevronDown,
    ChevronRight,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { useState } from "react";

interface PaginatedProducts {
    data: Product[];
    links: any;
    meta: any;
}

interface Category {
    id: string;
    name: string;
    count: number;
}

interface ProductListProps extends PageProps {
    category?: string;
    products?: PaginatedProducts;
    categories?: Category[];
    filters?: {
        price_min?: number;
        price_max?: number;
        features?: string[];
        rating?: number;
        search?: string;
        sort?: string;
    };
}

export default function ProductList({ auth, category, products, categories: categoriesFromBackend }: ProductListProps) {
    const user = auth.user;

    // 카테고리 정의 (백엔드에서 받은 데이터 사용, 없으면 mock 데이터 사용)
    const categories = categoriesFromBackend || [
        { id: "all", name: "전체상품", count: 24 },
        { id: "whitening", name: "미백케어", count: 8 },
        { id: "gum-care", name: "잇몸케어", count: 6 },
        { id: "sensitive", name: "민감치아", count: 5 },
        { id: "kids", name: "어린이용", count: 4 },
        { id: "herbal", name: "한방치약", count: 3 },
        { id: "total-care", name: "토탈케어", count: 4 },
        { id: "gift-sets", name: "선물세트", count: 2 },
    ];

    // 백엔드에서 받은 상품 데이터 (없으면 mock 데이터 사용)
    const productList: Product[] = products?.data || [
        {
            id: 1,
            name: "Dr.Smile 미백 치약 프로",
            description: "치과 미백 성분으로 누런 치아를 하얗게! 민감한 치아도 OK",
            price: 18900,
            originalPrice: 25000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "미백케어",
            badge: "BEST",
            rating: 4.8,
            reviewCount: 2345,
        },
        {
            id: 2,
            name: "Dr.Smile 잇몸케어 치약",
            description: "출혈과 염증을 완화하는 프로폴리스 함유 잇몸 전문 치약",
            price: 16900,
            originalPrice: 22000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "잇몸케어",
            badge: "NEW",
            rating: 4.7,
            reviewCount: 1823,
        },
        {
            id: 3,
            name: "Dr.Smile 어린이 치약",
            description: "아이들이 좋아하는 딸기맛! 불소 함유로 충치 예방까지",
            price: 14900,
            originalPrice: 19000,
            image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
            category: "어린이용",
            badge: "HOT",
            rating: 4.9,
            reviewCount: 3102,
        },
        {
            id: 4,
            name: "Dr.Smile 한방 치약",
            description: "천연 한방 성분으로 구취 제거와 잇몸 강화를 동시에",
            price: 17900,
            originalPrice: 23000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "한방치약",
            rating: 4.6,
            reviewCount: 1456,
        },
        {
            id: 5,
            name: "Dr.Smile 민감 치약",
            description: "시린이 완화 특허 성분 함유, 즉각적인 통증 완화",
            price: 19900,
            originalPrice: 26000,
            image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
            category: "민감치아",
            badge: "NEW",
            rating: 4.8,
            reviewCount: 2198,
        },
        {
            id: 6,
            name: "Dr.Smile 올인원 토탈케어",
            description: "미백+잇몸+충치예방을 한번에! 올인원 솔루션",
            price: 19900,
            originalPrice: 26000,
            image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
            category: "토탈케어",
            rating: 4.7,
            reviewCount: 1687,
        },
        {
            id: 7,
            name: "Dr.Smile 프리미엄 선물세트",
            description: "베스트 제품 3종으로 구성된 프리미엄 세트",
            price: 49900,
            originalPrice: 69000,
            image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
            category: "선물세트",
            badge: "HOT",
            rating: 4.9,
            reviewCount: 892,
        },
        {
            id: 8,
            name: "Dr.Smile 미백 인텐시브",
            description: "3일만에 효과! 강력한 미백 성분 함유",
            price: 22900,
            originalPrice: 29000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "미백케어",
            badge: "BEST",
            rating: 4.8,
            reviewCount: 2567,
        },
    ];

    const [selectedCategory, setSelectedCategory] = useState(category || "all");
    const [showFilters, setShowFilters] = useState(true);
    const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "rating" | "recent">(
        "popular"
    );

    // 필터 상태
    const [filters, setFilters] = useState({
        priceRanges: [] as string[],
        features: [] as string[],
        ratings: [] as number[],
    });

    const priceRanges = [
        { id: "under-15000", label: "15,000원 미만", min: 0, max: 15000 },
        { id: "15000-20000", label: "15,000원 - 20,000원", min: 15000, max: 20000 },
        { id: "20000-30000", label: "20,000원 - 30,000원", min: 20000, max: 30000 },
        { id: "over-30000", label: "30,000원 이상", min: 30000, max: 999999 },
    ];

    const features = [
        { id: "whitening", label: "미백 효과" },
        { id: "gum-care", label: "잇몸 케어" },
        { id: "cavity-prevention", label: "충치 예방" },
        { id: "sensitive", label: "시린이 완화" },
        { id: "breath", label: "구취 제거" },
        { id: "natural", label: "천연 성분" },
    ];

    const ratings = [4.5, 4.0, 3.5, 3.0];

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        // router.visit(`/products?category=${categoryId}`);
    };

    const handlePriceFilter = (priceId: string) => {
        setFilters((prev) => ({
            ...prev,
            priceRanges: prev.priceRanges.includes(priceId)
                ? prev.priceRanges.filter((id) => id !== priceId)
                : [...prev.priceRanges, priceId],
        }));
    };

    const handleFeatureFilter = (featureId: string) => {
        setFilters((prev) => ({
            ...prev,
            features: prev.features.includes(featureId)
                ? prev.features.filter((id) => id !== featureId)
                : [...prev.features, featureId],
        }));
    };

    const handleRatingFilter = (rating: number) => {
        setFilters((prev) => ({
            ...prev,
            ratings: prev.ratings.includes(rating)
                ? prev.ratings.filter((r) => r !== rating)
                : [...prev.ratings, rating],
        }));
    };

    const resetFilters = () => {
        setFilters({
            priceRanges: [],
            features: [],
            ratings: [],
        });
    };

    const hasActiveFilters =
        filters.priceRanges.length > 0 ||
        filters.features.length > 0 ||
        filters.ratings.length > 0;

    // 필터링된 상품
    const filteredProducts = productList.filter((product) => {
        // 카테고리 필터
        if (selectedCategory !== "all" && product.category !== categories.find(c => c.id === selectedCategory)?.name) {
            return false;
        }

        // 가격 필터
        if (filters.priceRanges.length > 0) {
            const matchesPrice = filters.priceRanges.some((rangeId) => {
                const range = priceRanges.find((r) => r.id === rangeId);
                if (!range) return false;
                return product.price >= range.min && product.price < range.max;
            });
            if (!matchesPrice) return false;
        }

        // 평점 필터
        if (filters.ratings.length > 0) {
            const matchesRating = filters.ratings.some((rating) => {
                return product.rating && product.rating >= rating;
            });
            if (!matchesRating) return false;
        }

        return true;
    });

    // 정렬
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            case "recent":
                return b.id - a.id;
            default: // popular
                return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
    });

    const currentCategoryName = categories.find((c) => c.id === selectedCategory)?.name || "전체상품";

    return (
        <>
            <Head title={`${currentCategoryName} - Dr.Smile`} />

            <div className="min-h-screen bg-background">
                <Header user={user} />

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                            <Link href="/" className="hover:text-foreground">
                                홈
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-medium">{currentCategoryName}</span>
                        </div>

                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">{currentCategoryName}</h1>
                            <p className="text-muted-foreground">
                                총 {sortedProducts.length}개의 상품이 있습니다
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar Filters */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    {/* Mobile Filter Toggle */}
                                    <Button
                                        variant="outline"
                                        className="w-full lg:hidden"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        필터 {showFilters ? "숨기기" : "보기"}
                                    </Button>

                                    <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                                        {/* Categories */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-4">카테고리</h3>
                                                <div className="space-y-2">
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => handleCategoryChange(cat.id)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                                selectedCategory === cat.id
                                                                    ? "bg-primary text-primary-foreground font-medium"
                                                                    : "hover:bg-muted"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span>{cat.name}</span>
                                                                <span className="text-xs opacity-70">
                                                                    {cat.count}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Price Range */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-4">가격대</h3>
                                                <div className="space-y-3">
                                                    {priceRanges.map((range) => (
                                                        <div key={range.id} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={range.id}
                                                                checked={filters.priceRanges.includes(range.id)}
                                                                onCheckedChange={() => handlePriceFilter(range.id)}
                                                            />
                                                            <Label
                                                                htmlFor={range.id}
                                                                className="text-sm cursor-pointer"
                                                            >
                                                                {range.label}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Features */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-4">효능/특징</h3>
                                                <div className="space-y-3">
                                                    {features.map((feature) => (
                                                        <div key={feature.id} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={feature.id}
                                                                checked={filters.features.includes(feature.id)}
                                                                onCheckedChange={() =>
                                                                    handleFeatureFilter(feature.id)
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={feature.id}
                                                                className="text-sm cursor-pointer"
                                                            >
                                                                {feature.label}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Rating */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-4">평점</h3>
                                                <div className="space-y-3">
                                                    {ratings.map((rating) => (
                                                        <div key={rating} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={`rating-${rating}`}
                                                                checked={filters.ratings.includes(rating)}
                                                                onCheckedChange={() => handleRatingFilter(rating)}
                                                            />
                                                            <Label
                                                                htmlFor={`rating-${rating}`}
                                                                className="text-sm cursor-pointer"
                                                            >
                                                                ⭐ {rating}점 이상
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Reset Filters */}
                                        {hasActiveFilters && (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={resetFilters}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                필터 초기화
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </aside>

                            {/* Product Grid */}
                            <main className="lg:col-span-3">
                                {/* Sort & View Options */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-sm text-muted-foreground">
                                        {sortedProducts.length}개 상품
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as any)}
                                            className="text-sm border rounded-lg px-3 py-2 bg-background"
                                        >
                                            <option value="popular">인기순</option>
                                            <option value="recent">최신순</option>
                                            <option value="price-low">낮은 가격순</option>
                                            <option value="price-high">높은 가격순</option>
                                            <option value="rating">평점순</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Products */}
                                {sortedProducts.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-20">
                                            <div className="text-center">
                                                <p className="text-muted-foreground mb-4">
                                                    해당하는 상품이 없습니다
                                                </p>
                                                <Button onClick={resetFilters}>필터 초기화</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {sortedProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
