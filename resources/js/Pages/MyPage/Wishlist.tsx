import { Head, Link, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface WishlistItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    salePrice: number | null;
    discountRate: number | null;
    image: string;
    rating: number;
    reviewCount: number;
    stock: number;
    isInStock: boolean;
    addedAt: string;
}

interface WishlistProps extends PageProps {
    wishlists: WishlistItem[];
}

export default function Wishlist({ auth, wishlists: initialWishlists }: WishlistProps) {
    const user = auth.user!;
    const [wishlists, setWishlists] = useState(initialWishlists);
    const [loading, setLoading] = useState<number | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const handleRemove = async (wishlistId: number) => {
        if (!confirm("찜 목록에서 삭제하시겠습니까?")) {
            return;
        }

        setLoading(wishlistId);
        try {
            await axios.delete(`/api/mypage/wishlist/${wishlistId}`);
            setWishlists(wishlists.filter((item) => item.id !== wishlistId));
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
            alert("삭제에 실패했습니다.");
        } finally {
            setLoading(null);
        }
    };

    const handleAddToCart = (productId: number) => {
        // TODO: Implement add to cart
        console.log("Add to cart:", productId);
        alert("장바구니 기능은 개발 중입니다.");
    };

    return (
        <>
            <Head title="찜한 상품" />

            <MyPageLayout user={user} currentPage="wishlist">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">찜한 상품</h1>
                            <p className="text-muted-foreground mt-1">
                                {wishlists.length}개의 상품
                            </p>
                        </div>
                    </div>

                    {wishlists.length === 0 ? (
                        <Card>
                            <CardContent className="py-16">
                                <div className="text-center">
                                    <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        찜한 상품이 없습니다
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        마음에 드는 상품을 찜해보세요
                                    </p>
                                    <Button asChild>
                                        <Link href="/products">상품 둘러보기</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlists.map((item) => (
                                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-64 object-cover"
                                        />
                                        {item.discountRate && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute top-3 left-3"
                                            >
                                                {item.discountRate}% 할인
                                            </Badge>
                                        )}
                                        {!item.isInStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Badge variant="secondary" className="text-lg">
                                                    품절
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-4 space-y-3">
                                        <div>
                                            <Link
                                                href={`/products/${item.productId}`}
                                                className="font-medium hover:underline line-clamp-2"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                                <span className="text-yellow-500">★</span>
                                                <span>{item.rating.toFixed(1)}</span>
                                                <span>({item.reviewCount})</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            {item.salePrice ? (
                                                <>
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        {formatPrice(item.price)}
                                                    </div>
                                                    <div className="text-xl font-bold text-primary">
                                                        {formatPrice(item.salePrice)}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-xl font-bold">
                                                    {formatPrice(item.price)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            {item.addedAt} 추가
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                size="sm"
                                                onClick={() => handleAddToCart(item.productId)}
                                                disabled={!item.isInStock || loading === item.id}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                장바구니
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemove(item.id)}
                                                disabled={loading === item.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </MyPageLayout>
        </>
    );
}
