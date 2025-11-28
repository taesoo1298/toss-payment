import { Head, Link, router } from "@inertiajs/react";
import { PageProps, Product } from "@/types";
import Header from "@/Components/Header";
import ProductCard from "@/Components/ProductCard";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
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
import axios from "axios";

interface Review {
    id: number;
    userName: string;
    rating: number;
    date: string;
    content: string;
    images?: string[];
    verified: boolean;
}

interface Settings {
    shippingPolicy: string;
    returnPolicy: string;
    exchangePolicy: string;
    shippingCost: number;
    freeShippingThreshold: number;
    pointRate: number;
}

interface ProductDetailProps extends PageProps {
    product: Product;
    relatedProducts: Product[];
    reviews?: Review[];
    settings?: Settings;
}

export default function ProductDetail({
    auth,
    product,
    relatedProducts,
    reviews = [],
    settings,
}: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewContent, setReviewContent] = useState("");
    const [reviewImages, setReviewImages] = useState<string[]>([]);

    // 상품 이미지 배열
    const productImages = product?.images && product.images.length > 0
        ? [product.image, ...product.images]
        : [product.image || "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80"];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const discountPercentage = product?.originalPrice
        ? Math.round(
              ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
          )
        : 0;

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    const handleAddToCart = async () => {
        try {
            await axios.post("/api/cart/items", {
                product_id: product.id,
                quantity: quantity,
            });

            // Success: show confirmation and ask if user wants to go to cart
            const goToCart = confirm(
                `${product.name} ${quantity}개가 장바구니에 담겼습니다.\n\n장바구니로 이동하시겠습니까?`
            );

            if (goToCart) {
                router.visit("/cart");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "장바구니 추가에 실패했습니다.";
            alert(message);
        }
    };

    const handleSubmitReview = () => {
        if (!reviewContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        // Mock review submission
        alert(
            `리뷰가 등록되었습니다!\n평점: ${reviewRating}점\n내용: ${reviewContent}`
        );

        // Reset form
        setReviewDialogOpen(false);
        setReviewRating(5);
        setReviewContent("");
        setReviewImages([]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // Mock image upload - 실제로는 서버에 업로드
            const newImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
            setReviewImages((prev) => [...prev, ...newImages].slice(0, 5)); // 최대 5장
        }
    };

    const removeReviewImage = (index: number) => {
        setReviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleBuyNow = () => {
        // 바로 구매 로직 (결제 페이지로 이동)
        router.visit("/checkout", {
            method: "get",
            data: {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: quantity,
            },
        });
    };

    return (
        <>
            <Head title={product.name} />

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
                            href={`/category/${product.category}`}
                            className="hover:text-primary"
                        >
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">
                            {product.name}
                        </span>
                    </div>

                    <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 mb-12">
                        {/* Product Images - 500px */}
                        <div className="w-full lg:w-[500px] flex-shrink-0">
                            <Card className="overflow-hidden mb-4 sticky top-24">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
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
                                            alt={`${product.name} ${
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
                                {product.name}
                            </h1>

                            {/* 키워드 */}
                            {product.keywords && product.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.keywords.map((keyword, idx) => (
                                        <span key={idx} className="text-sm text-primary">
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 특징 3개 */}
                            {product.features && product.features.length > 0 && (
                                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                    <div className="space-y-2 text-sm">
                                        {product.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 가격 정보 */}
                            <div className="border-t border-b py-4 mb-4">
                                {product.originalPrice && (
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
                                            product.originalPrice ||
                                                product.price
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold">
                                        판매가
                                    </span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatPrice(product.price)}
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
                                        {settings && settings.freeShippingThreshold > 0
                                            ? `${(settings.freeShippingThreshold / 1000).toFixed(0)}만원 이상 무료배송`
                                            : "무료배송"}
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
                                        {settings && `${(settings.freeShippingThreshold / 10000).toFixed(0)}만원 이상 무료 / ${(settings.freeShippingThreshold / 10000).toFixed(0)}만원 미만 ${settings.shippingCost.toLocaleString()}원`}
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
                                            product.price * (settings?.pointRate ?? 1) / 100
                                        ).toLocaleString()}
                                        원 ({settings?.pointRate ?? 1}%)
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
                                                product.price * quantity
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
                                        리뷰 ({product.reviewCount})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="p-6">
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.description || '상세정보가 준비 중입니다.' }}
                                    />
                                </TabsContent>

                                <TabsContent
                                    value="ingredients"
                                    className="p-6"
                                >
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.ingredients || '성분 정보가 준비 중입니다.' }}
                                    />
                                </TabsContent>

                                <TabsContent value="usage" className="p-6">
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.usage_instructions || product.usageInstructions || '사용 방법 정보가 준비 중입니다.' }}
                                    />
                                </TabsContent>

                                <TabsContent value="reviews" className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <div className="text-4xl font-bold mb-2">
                                                    {product.rating}
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
                                                                            product.rating!
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
                                                    {product.reviewCount}
                                                    개의 리뷰
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    setReviewDialogOpen(true)
                                                }
                                            >
                                                리뷰 작성
                                            </Button>
                                        </div>

                                        {/* Reviews List */}
                                        {reviews.map((review) => (
                                            <Card key={review.id}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-semibold">
                                                                {
                                                                    review.userName
                                                                }
                                                            </span>
                                                            {review.verified && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-green-50 text-green-700 border-green-200"
                                                                >
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                    구매확인
                                                                </Badge>
                                                            )}
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
                                                    <p className="mb-3">
                                                        {review.content}
                                                    </p>
                                                    {review.images &&
                                                        review.images.length >
                                                            0 && (
                                                            <div className="flex gap-2 mt-3">
                                                                {review.images.map(
                                                                    (
                                                                        image,
                                                                        idx
                                                                    ) => (
                                                                        <img
                                                                            key={
                                                                                idx
                                                                            }
                                                                            src={
                                                                                image
                                                                            }
                                                                            alt={`리뷰 이미지 ${
                                                                                idx +
                                                                                1
                                                                            }`}
                                                                            className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    image,
                                                                                    "_blank"
                                                                                )
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
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
                                {relatedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Review Write Dialog */}
                <Dialog
                    open={reviewDialogOpen}
                    onOpenChange={setReviewDialogOpen}
                >
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>리뷰 작성</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Rating */}
                            <div className="space-y-2">
                                <Label>
                                    평점{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() =>
                                                setReviewRating(rating)
                                            }
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${
                                                    rating <= reviewRating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-3 text-lg font-semibold text-yellow-600">
                                        {reviewRating}.0
                                    </span>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="space-y-2">
                                <Label htmlFor="reviewContent">
                                    리뷰 내용{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <textarea
                                    id="reviewContent"
                                    value={reviewContent}
                                    onChange={(e) =>
                                        setReviewContent(e.target.value)
                                    }
                                    placeholder="상품에 대한 솔직한 리뷰를 남겨주세요. (최소 10자 이상)"
                                    className="w-full min-h-[150px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {reviewContent.length}자
                                </p>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="reviewImages">
                                    사진 첨부 (선택, 최대 5장)
                                </Label>
                                <div className="space-y-3">
                                    <Input
                                        id="reviewImages"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="cursor-pointer"
                                    />

                                    {/* Image Preview */}
                                    {reviewImages.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {reviewImages.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`미리보기 ${
                                                                index + 1
                                                            }`}
                                                            className="w-20 h-20 object-cover rounded-lg border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeReviewImage(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        상품과 관련된 사진을 첨부하면 다른
                                        고객에게 더 도움이 됩니다.
                                    </p>
                                </div>
                            </div>

                            {/* Review Guidelines */}
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-sm mb-2">
                                    리뷰 작성 가이드
                                </h4>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                    <li>
                                        • 상품과 무관한 내용이나 광고성 게시물은
                                        삭제될 수 있습니다.
                                    </li>
                                    <li>
                                        • 타인의 권리를 침해하거나 명예를
                                        훼손하는 내용은 금지됩니다.
                                    </li>
                                    <li>
                                        • 작성하신 리뷰는 마이페이지에서 확인 및
                                        수정할 수 있습니다.
                                    </li>
                                    <li>
                                        • 구매 확인된 리뷰 작성 시 포인트가
                                        적립됩니다.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setReviewDialogOpen(false);
                                    setReviewRating(5);
                                    setReviewContent("");
                                    setReviewImages([]);
                                }}
                            >
                                취소
                            </Button>
                            <Button onClick={handleSubmitReview}>
                                리뷰 등록
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
