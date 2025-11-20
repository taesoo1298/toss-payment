import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    ShoppingBag,
    Package,
    Truck,
    CheckCircle2,
    Heart,
    Gift,
    Award,
    Star,
    ChevronRight,
    CreditCard,
    MapPin,
} from "lucide-react";

interface RecentOrder {
    id: string;
    orderId: string;
    date: string;
    status: string;
    statusLabel: string;
    itemCount: number;
    totalAmount: number;
    thumbnail: string;
}

export default function Dashboard({ auth }: PageProps) {
    const user = auth.user!;

    // Mock data
    const stats = {
        preparing: 1,
        shipping: 1,
        delivered: 1,
        points: 5470,
        coupons: 3,
        wishlist: 8,
    };

    const recentOrders: RecentOrder[] = [
        {
            id: "1",
            orderId: "ORDER-20251029-001234",
            date: "2025-10-29",
            status: "preparing",
            statusLabel: "상품준비중",
            itemCount: 2,
            totalAmount: 54700,
            thumbnail: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80",
        },
        {
            id: "2",
            orderId: "ORDER-20251025-005678",
            date: "2025-10-25",
            status: "delivered",
            statusLabel: "배송완료",
            itemCount: 1,
            totalAmount: 44700,
            thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&q=80",
        },
        {
            id: "3",
            orderId: "ORDER-20251020-003456",
            date: "2025-10-20",
            status: "shipping",
            statusLabel: "배송중",
            itemCount: 2,
            totalAmount: 55700,
            thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&q=80",
        },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    return (
        <>
            <Head title="마이페이지" />

            <MyPageLayout user={user} currentPage="dashboard">
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <Card className="bg-gradient-to-r from-primary/10 to-cyan-500/10">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        안녕하세요, {user.name}님! 👋
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Dr.Smile과 함께 건강한 치아 관리를 시작하세요
                                    </p>
                                </div>
                                <Award className="h-16 w-16 text-primary/50" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Status */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">주문 배송 현황</h3>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/mypage/orders">
                                    전체보기
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/mypage/orders?status=preparing">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <Package className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                                            <div className="text-2xl font-bold mb-1">{stats.preparing}</div>
                                            <div className="text-sm text-muted-foreground">상품준비중</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/mypage/orders?status=shipping">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <Truck className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                                            <div className="text-2xl font-bold mb-1">{stats.shipping}</div>
                                            <div className="text-sm text-muted-foreground">배송중</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/mypage/orders?status=delivered">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                            <div className="text-2xl font-bold mb-1">{stats.delivered}</div>
                                            <div className="text-sm text-muted-foreground">배송완료</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/mypage/wishlist">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                                            <div className="text-2xl font-bold mb-1">{stats.wishlist}</div>
                                            <div className="text-sm text-muted-foreground">찜한 상품</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>

                    {/* Points & Coupons */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">혜택 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">
                                                사용 가능 포인트
                                            </div>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatPrice(stats.points)}
                                            </div>
                                        </div>
                                        <Gift className="h-10 w-10 text-primary/50" />
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-4">
                                        포인트 내역 보기
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">보유 쿠폰</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {stats.coupons}장
                                            </div>
                                        </div>
                                        <CreditCard className="h-10 w-10 text-primary/50" />
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                                        <Link href="/mypage/coupons">쿠폰함 보기</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" />
                                    최근 주문 내역
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/mypage/orders">
                                        전체보기
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground mb-4">주문 내역이 없습니다</p>
                                    <Button asChild>
                                        <Link href="/">쇼핑 시작하기</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <img
                                                src={order.thumbnail}
                                                alt="Order"
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm text-muted-foreground">
                                                        {order.date}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {order.statusLabel}
                                                    </Badge>
                                                </div>
                                                <div className="font-medium mb-1 truncate">
                                                    주문번호: {order.orderId}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {order.itemCount}개 상품 · {formatPrice(order.totalAmount)}
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/order/complete?orderId=${order.orderId}`}
                                                >
                                                    상세보기
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">빠른 메뉴</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 py-6"
                                asChild
                            >
                                <Link href="/mypage/addresses">
                                    <MapPin className="h-8 w-8" />
                                    <span>배송지 관리</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 py-6"
                                asChild
                            >
                                <Link href="/mypage/payments">
                                    <CreditCard className="h-8 w-8" />
                                    <span>결제 수단</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 py-6"
                                asChild
                            >
                                <Link href="/mypage/wishlist">
                                    <Heart className="h-8 w-8" />
                                    <span>찜한 상품</span>
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto flex-col gap-2 py-6"
                                asChild
                            >
                                <Link href="/help">
                                    <Star className="h-8 w-8" />
                                    <span>고객센터</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Membership Benefits */}
                    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Award className="h-12 w-12 text-amber-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-amber-900 mb-2">
                                        Dr.Smile 멤버십 혜택
                                    </h3>
                                    <ul className="space-y-1 text-sm text-amber-800">
                                        <li>✓ 첫 구매 시 10% 추가 할인</li>
                                        <li>✓ 구매 금액의 1% 포인트 적립</li>
                                        <li>✓ 매월 생일 쿠폰 제공</li>
                                        <li>✓ 신제품 우선 구매 기회</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MyPageLayout>
        </>
    );
}
