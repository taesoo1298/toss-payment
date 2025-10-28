import { Head, Link, router } from "@inertiajs/react";
import { PageProps, Product } from "@/types";
import Header from "@/Components/Header";
import ProductCard from "@/Components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Minus,
    Plus,
    CheckCircle2,
    Truck,
    RefreshCcw,
    Shield,
    Smile,
    Sparkles,
} from "lucide-react";
import { useState } from "react";

interface ProductDetailProps extends PageProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({
    auth,
    product,
    relatedProducts,
}: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Mock product data (실제로는 백엔드에서 받아옴)
    const mockProduct: Product = product || {
        id: 1,
        name: "Dr.Smile 미백 치약 프로",
        description: "치과 미백 성분으로 누런 치아를 하얗게! 민감한 치아도 OK",
        price: 18900,
        originalPrice: 25000,
        image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80",
        category: "미백케어",
        badge: "BEST",
        rating: 4.8,
        reviewCount: 2345,
    };

    const mockRelatedProducts: Product[] = relatedProducts || [
        {
            id: 2,
            name: "Dr.Smile 잇몸케어 치약",
            description: "출혈과 염증을 완화하는 프로폴리스 함유",
            price: 16900,
            originalPrice: 22000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "잇몸케어",
            rating: 4.9,
            reviewCount: 1876,
        },
        {
            id: 3,
            name: "Dr.Smile 민감치아 전용",
            description: "시린이 증상 완화, 질산칼륨 함유",
            price: 17900,
            image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80",
            category: "민감케어",
            rating: 4.7,
            reviewCount: 1432,
        },
        {
            id: 6,
            name: "Dr.Smile 올인원 토탈케어",
            description: "미백+잇몸+충치예방을 한번에!",
            price: 19900,
            originalPrice: 26000,
            image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
            category: "토탈케어",
            rating: 4.9,
            reviewCount: 2134,
        },
        {
            id: 8,
            name: "Dr.Smile 선물세트 프리미엄",
            description: "베스트 3종 + 칫솔 세트",
            price: 49900,
            originalPrice: 65000,
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
            category: "선물세트",
            rating: 5.0,
            reviewCount: 892,
        },
    ];

    const productImages = [
        mockProduct.image,
        "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80",
        "https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=800&q=80",
        "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80",
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const discountPercentage = mockProduct.originalPrice
        ? Math.round(
              ((mockProduct.originalPrice - mockProduct.price) /
                  mockProduct.originalPrice) *
                  100
          )
        : 0;

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    const handleAddToCart = () => {
        // 장바구니 추가 로직
        alert(`${mockProduct.name} ${quantity}개가 장바구니에 담겼습니다.`);
    };

    const handleBuyNow = () => {
        // 바로 구매 로직 (결제 페이지로 이동)
        router.visit("/payments/create", {
            method: "get",
            data: {
                productId: mockProduct.id,
                productName: mockProduct.name,
                price: mockProduct.price,
                quantity: quantity,
            },
        });
    };

    return (
        <>
            <Head title={mockProduct.name} />

            <div className="min-h-screen bg-background">
                <Header user={auth.user} />

                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-primary">
                            홈
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/category/${mockProduct.category}`}
                            className="hover:text-primary"
                        >
                            {mockProduct.category}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">
                            {mockProduct.name}
                        </span>
                    </div>

                    <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 mb-12">
                        {/* Product Images - 500px */}
                        <div className="w-full lg:w-[500px] flex-shrink-0">
                            <Card className="overflow-hidden mb-4 sticky top-24">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={mockProduct.name}
                                    className="w-full h-[500px] object-cover"
                                />
                            </Card>
                            <div className="grid grid-cols-4 gap-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden transition-all ${
                                            selectedImage === index
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${mockProduct.name} ${
                                                index + 1
                                            }`}
                                            className="w-full aspect-square object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info - 500px */}
                        <div className="flex-1 lg:w-[500px]">
                            {/* 상품명 */}
                            <h1 className="text-2xl font-bold mb-3">
                                {mockProduct.name}
                            </h1>

                            {/* 키워드 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-sm text-primary">
                                    #치과의사개발
                                </span>
                                <span className="text-sm text-primary">
                                    #임상실험
                                </span>
                                <span className="text-sm text-primary">
                                    #천연성분
                                </span>
                                <span className="text-sm text-primary">
                                    #미백효과
                                </span>
                            </div>

                            {/* 특징 3개 */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span>
                                            대학병원 임상실험으로 검증된 미백
                                            효과
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span>
                                            95% 천연 유래 성분, 유해물질 무첨가
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span>
                                            민감한 치아에도 자극 없이 사용 가능
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 가격 정보 */}
                            <div className="border-t border-b py-4 mb-4">
                                {mockProduct.originalPrice && (
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">
                                            할인율
                                        </span>
                                        <span className="text-lg font-bold text-destructive">
                                            {discountPercentage}%
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">
                                        정상가
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(
                                            mockProduct.originalPrice ||
                                                mockProduct.price
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold">
                                        판매가
                                    </span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatPrice(mockProduct.price)}
                                    </span>
                                </div>
                            </div>

                            {/* 배송 정보 */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        배송
                                    </span>
                                    <span className="font-medium">
                                        무료배송
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        출고 안내
                                    </span>
                                    <span className="font-medium">
                                        오늘 출발 (18시 이전 주문 시)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        배송비
                                    </span>
                                    <span className="font-medium">
                                        3만원 이상 무료 / 3만원 미만 3,000원
                                    </span>
                                </div>
                            </div>

                            {/* 적립 */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-amber-800 font-medium">
                                        적립 혜택
                                    </span>
                                    <span className="text-amber-900 font-bold">
                                        {Math.floor(
                                            mockProduct.price * 0.01
                                        ).toLocaleString()}
                                        원 (1%)
                                    </span>
                                </div>
                            </div>

                            {/* 옵션 선택 */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    옵션 선택
                                </label>
                                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>단품 (120g)</option>
                                    <option>2개 세트 (+5% 추가할인)</option>
                                    <option>3개 세트 (+10% 추가할인)</option>
                                </select>
                            </div>

                            {/* 수량 선택 및 총 금액 */}
                            <div className="border-t pt-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">수량</span>
                                    <div className="flex items-center border rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                handleQuantityChange(-1)
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-semibold">
                                            {quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                handleQuantityChange(1)
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t">
                                    <span className="font-semibold">
                                        총 상품금액
                                    </span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {formatPrice(
                                                mockProduct.price * quantity
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            ({quantity}개)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 구매 버튼 */}
                            <div className="space-y-2">
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg font-semibold"
                                    onClick={handleBuyNow}
                                >
                                    바로 구매하기
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        장바구니
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="px-4"
                                    >
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="max-w-[1200px] mx-auto">
                        <Card className="mb-12">
                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="details"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        상세정보
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ingredients"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        성분정보
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="usage"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        사용방법
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reviews"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        리뷰 ({mockProduct.reviewCount})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="p-6">
                                    <div className="prose max-w-none">
                                        <h3 className="text-2xl font-bold mb-4">
                                            제품 상세정보
                                        </h3>
                                        <p className="mb-4">
                                            Dr.Smile 미백 치약 프로는 20년
                                            임상경험을 가진 치과의사가 직접
                                            개발한 전문 미백 치약입니다. 일반
                                            미백 치약과 달리 치아를 손상시키지
                                            않으면서도 효과적으로 미백 효과를
                                            제공합니다.
                                        </p>
                                        <h4 className="text-xl font-semibold mb-3">
                                            주요 특징
                                        </h4>
                                        <ul className="list-disc pl-6 space-y-2 mb-4">
                                            <li>
                                                치과에서 사용하는 미백 성분 함유
                                            </li>
                                            <li>
                                                민감한 치아에도 자극 없이 사용
                                                가능
                                            </li>
                                            <li>95% 천연 유래 성분으로 안전</li>
                                            <li>식약처 인증 의약외품</li>
                                            <li>대학병원 임상실험 완료</li>
                                        </ul>
                                        <h4 className="text-xl font-semibold mb-3">
                                            사용 대상
                                        </h4>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>
                                                커피, 차, 담배로 인한 치아
                                                착색이 신경쓰이시는 분
                                            </li>
                                            <li>
                                                치아 미백을 원하지만 민감한 치아
                                                때문에 망설이시는 분
                                            </li>
                                            <li>
                                                안전한 성분의 치약을 찾으시는 분
                                            </li>
                                            <li>
                                                전문가가 만든 프리미엄 치약을
                                                원하시는 분
                                            </li>
                                        </ul>
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="ingredients"
                                    className="p-6"
                                >
                                    <div className="prose max-w-none">
                                        <h3 className="text-2xl font-bold mb-4">
                                            성분 정보
                                        </h3>
                                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold mb-2">
                                                주요 성분
                                            </h4>
                                            <ul className="space-y-2">
                                                <li>
                                                    <strong>
                                                        수산화인회석
                                                    </strong>{" "}
                                                    - 자연 미백 효과
                                                </li>
                                                <li>
                                                    <strong>질산칼륨</strong> -
                                                    시린이 완화
                                                </li>
                                                <li>
                                                    <strong>자일리톨</strong> -
                                                    충치 예방
                                                </li>
                                                <li>
                                                    <strong>
                                                        프로폴리스 추출물
                                                    </strong>{" "}
                                                    - 잇몸 건강
                                                </li>
                                                <li>
                                                    <strong>
                                                        알로에베라 추출물
                                                    </strong>{" "}
                                                    - 구강 진정
                                                </li>
                                            </ul>
                                        </div>
                                        <h4 className="font-semibold mb-2">
                                            무첨가
                                        </h4>
                                        <p className="text-muted-foreground">
                                            파라벤, 트리클로산, 인공색소,
                                            합성향료, SLS, SLES 무첨가
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="usage" className="p-6">
                                    <div className="prose max-w-none">
                                        <h3 className="text-2xl font-bold mb-4">
                                            사용 방법
                                        </h3>
                                        <ol className="list-decimal pl-6 space-y-3">
                                            <li>
                                                칫솔에 적당량(완두콩 크기)을
                                                짜줍니다.
                                            </li>
                                            <li>
                                                치아와 잇몸을 부드럽게 2-3분간
                                                닦아줍니다.
                                            </li>
                                            <li>
                                                깨끗한 물로 충분히 헹궈냅니다.
                                            </li>
                                            <li>
                                                하루 3회, 식후 사용을
                                                권장합니다.
                                            </li>
                                        </ol>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <Smile className="h-5 w-5 text-primary" />
                                                치과의사 TIP
                                            </h4>
                                            <p className="text-sm">
                                                미백 효과를 극대화하려면 칫솔질
                                                후 30분간 음식물 섭취를
                                                자제해주세요. 또한 색소가 강한
                                                음식(커피, 홍차, 와인) 섭취
                                                후에는 바로 양치하는 것이
                                                좋습니다.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <div className="text-4xl font-bold mb-2">
                                                    {mockProduct.rating}
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-5 w-5 ${
                                                                        i <
                                                                        Math.floor(
                                                                            mockProduct.rating!
                                                                        )
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {mockProduct.reviewCount}
                                                    개의 리뷰
                                                </div>
                                            </div>
                                            <Button>리뷰 작성</Button>
                                        </div>

                                        {/* Sample Reviews */}
                                        {[
                                            {
                                                author: "김**",
                                                rating: 5,
                                                date: "2025.01.15",
                                                content:
                                                    "정말 효과가 좋아요! 2주 사용했는데 눈에 띄게 하얘졌어요. 시린 증상도 없고 만족합니다.",
                                            },
                                            {
                                                author: "이**",
                                                rating: 5,
                                                date: "2025.01.12",
                                                content:
                                                    "치과의사가 만든 제품이라 믿고 샀는데 역시 다르네요. 가격은 좀 있지만 그만한 가치가 있습니다.",
                                            },
                                            {
                                                author: "박**",
                                                rating: 4,
                                                date: "2025.01.10",
                                                content:
                                                    "미백 효과는 확실히 있는데 좀 더 빨리 효과가 나타났으면 좋겠어요. 그래도 만족해요!",
                                            },
                                        ].map((review, index) => (
                                            <Card key={index}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-semibold">
                                                                {review.author}
                                                            </span>
                                                            <div className="flex">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
                                                                        <Star
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`h-4 w-4 ${
                                                                                i <
                                                                                review.rating
                                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                                    : "text-gray-300"
                                                                            }`}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {review.date}
                                                        </span>
                                                    </div>
                                                    <p>{review.content}</p>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        <div className="text-center">
                                            <Button variant="outline">
                                                리뷰 더보기
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>

                        {/* Related Products */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">
                                이런 상품은 어떠세요?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {mockRelatedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-background border-t py-12 mt-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Smile className="h-6 w-6 text-primary" />
                                    <h3 className="font-bold text-lg">
                                        Dr.Smile
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    치과의사가 만든 프리미엄 치약
                                    <br />
                                    건강한 미소를 위한 첫걸음
                                </p>
                            </div>
                        </div>
                        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                            <p>&copy; 2025 Dr.Smile. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
