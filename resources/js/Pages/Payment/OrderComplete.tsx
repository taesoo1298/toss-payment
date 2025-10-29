import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, CreditCard, MapPin, User, Phone, Mail } from "lucide-react";
import { PageProps } from "@/types";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface OrderCompleteProps extends PageProps {
    orderId?: string;
    paymentKey?: string;
    amount?: number;
    orderDate?: string;
    estimatedDelivery?: string;
    items?: OrderItem[];
    customerInfo?: {
        name: string;
        email: string;
        phone: string;
    };
    shippingInfo?: {
        recipient: string;
        phone: string;
        address: string;
        message?: string;
    };
}

export default function OrderComplete({
    auth,
    orderId,
    paymentKey,
    amount,
    orderDate,
    estimatedDelivery,
    items,
    customerInfo,
    shippingInfo,
}: OrderCompleteProps) {
    const user = auth.user;

    // Mock data for demonstration
    const mockOrderId = orderId || "ORDER-20251029-001234";
    const mockAmount = amount || 54700;
    const mockOrderDate = orderDate || new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const mockEstimatedDelivery = estimatedDelivery || "2025년 10월 31일 (목)";

    const mockItems: OrderItem[] = items || [
        {
            id: 1,
            name: "Dr.Smile 미백 치약 프로",
            price: 18900,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80",
        },
        {
            id: 2,
            name: "Dr.Smile 잇몸케어 치약",
            price: 16900,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80",
        },
    ];

    const mockCustomerInfo = customerInfo || {
        name: user?.name || "홍길동",
        email: user?.email || "example@email.com",
        phone: "010-1234-5678",
    };

    const mockShippingInfo = shippingInfo || {
        recipient: "홍길동",
        phone: "010-1234-5678",
        address: "서울특별시 강남구 테헤란로 123, 456호",
        message: "부재 시 문앞에 놓아주세요",
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const productTotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = productTotal >= 30000 ? 0 : 3000;

    return (
        <>
            <Head title="주문 완료" />

            <div className="min-h-screen bg-background">
                <Header user={user} />

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-[1000px] mx-auto">
                        {/* Success Message */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">주문이 완료되었습니다!</h1>
                            <p className="text-muted-foreground">
                                주문번호: <span className="font-semibold text-foreground">{mockOrderId}</span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Order Status */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">주문일시</div>
                                            <div className="font-medium">{mockOrderDate}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground mb-1">예상 배송일</div>
                                            <div className="font-medium text-primary">{mockEstimatedDelivery}</div>
                                        </div>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-2">
                                                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                                            </div>
                                            <span className="text-xs font-medium">주문완료</span>
                                        </div>
                                        <div className="flex-1 h-0.5 bg-border mx-2"></div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">상품준비중</span>
                                        </div>
                                        <div className="flex-1 h-0.5 bg-border mx-2"></div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                                <Truck className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">배송중</span>
                                        </div>
                                        <div className="flex-1 h-0.5 bg-border mx-2"></div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">배송완료</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <Package className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-blue-900">
                                                <strong>18시 이전 주문</strong>으로 오늘 출고 예정입니다.
                                                <br />
                                                배송 준비가 완료되면 카카오톡으로 알려드립니다.
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        주문 상품
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockItems.map((item) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium mb-1">{item.name}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatPrice(item.price)} × {item.quantity}개
                                                        </span>
                                                        <span className="font-bold text-primary">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            배송 정보
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">받는 사람</div>
                                            <div className="font-medium">{mockShippingInfo.recipient}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">연락처</div>
                                            <div className="font-medium">{mockShippingInfo.phone}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">배송지</div>
                                            <div className="font-medium">{mockShippingInfo.address}</div>
                                        </div>
                                        {mockShippingInfo.message && (
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-1">배송 메시지</div>
                                                <div className="font-medium text-sm">{mockShippingInfo.message}</div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Payment Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            결제 정보
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">상품 금액</span>
                                            <span className="font-medium">{formatPrice(productTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">배송비</span>
                                            <span className="font-medium">
                                                {shippingFee === 0 ? "무료" : formatPrice(shippingFee)}
                                            </span>
                                        </div>
                                        <div className="pt-3 border-t flex justify-between items-center">
                                            <span className="font-semibold">결제 금액</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatPrice(mockAmount)}
                                            </span>
                                        </div>
                                        {paymentKey && (
                                            <div className="pt-3 border-t">
                                                <div className="text-xs text-muted-foreground mb-1">결제 키</div>
                                                <div className="text-xs font-mono break-all bg-muted p-2 rounded">
                                                    {paymentKey}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Customer Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        주문자 정보
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">이름</div>
                                            <div className="font-medium">{mockCustomerInfo.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">이메일</div>
                                            <div className="font-medium text-sm">{mockCustomerInfo.email}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">연락처</div>
                                            <div className="font-medium">{mockCustomerInfo.phone}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button size="lg" className="flex-1" asChild>
                                    <Link href="/mypage/orders">주문 내역 보기</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="flex-1" asChild>
                                    <Link href="/">쇼핑 계속하기</Link>
                                </Button>
                            </div>

                            {/* Additional Info */}
                            <Card className="bg-muted/50">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-3">안내사항</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>
                                                주문 확인 및 영수증은 등록하신 이메일로 발송됩니다.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>
                                                배송 조회는 마이페이지 {'>'} 주문내역에서 확인하실 수 있습니다.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>
                                                주문 후 30일 이내 미개봉 상품에 한해 환불이 가능합니다.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span>
                                                문의사항은 고객센터(1588-1234) 또는 카카오톡 채널로 연락 주시기 바랍니다.
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
