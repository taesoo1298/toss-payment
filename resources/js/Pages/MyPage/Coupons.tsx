import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Ticket,
    Plus,
    Calendar,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

interface Coupon {
    id: string;
    code: string;
    name: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minPurchaseAmount: number;
    maxDiscountAmount?: number;
    expiryDate: string;
    isUsed: boolean;
    usedDate?: string;
    isExpired: boolean;
}

export default function Coupons({ auth }: PageProps) {
    const user = auth.user!;

    // Mock coupon data
    const mockCoupons: Coupon[] = [
        {
            id: "1",
            code: "WELCOME10",
            name: "신규회원 10% 할인",
            description: "첫 구매 시 10% 할인 혜택",
            discountType: "percentage",
            discountValue: 10,
            minPurchaseAmount: 0,
            maxDiscountAmount: 5000,
            expiryDate: "2025-12-31",
            isUsed: false,
            isExpired: false,
        },
        {
            id: "2",
            code: "SMILE5000",
            name: "5,000원 즉시 할인",
            description: "30,000원 이상 구매 시 사용 가능",
            discountType: "fixed",
            discountValue: 5000,
            minPurchaseAmount: 30000,
            expiryDate: "2025-11-30",
            isUsed: false,
            isExpired: false,
        },
        {
            id: "3",
            code: "BIRTHDAY20",
            name: "생일 축하 20% 할인",
            description: "생일 축하 특별 할인 쿠폰",
            discountType: "percentage",
            discountValue: 20,
            minPurchaseAmount: 20000,
            maxDiscountAmount: 10000,
            expiryDate: "2025-11-15",
            isUsed: false,
            isExpired: false,
        },
        {
            id: "4",
            code: "USED3000",
            name: "3,000원 할인",
            description: "사용 완료된 쿠폰",
            discountType: "fixed",
            discountValue: 3000,
            minPurchaseAmount: 20000,
            expiryDate: "2025-12-31",
            isUsed: true,
            usedDate: "2025-10-20",
            isExpired: false,
        },
        {
            id: "5",
            code: "EXPIRED10",
            name: "만료된 10% 할인",
            description: "기간이 만료된 쿠폰",
            discountType: "percentage",
            discountValue: 10,
            minPurchaseAmount: 15000,
            maxDiscountAmount: 5000,
            expiryDate: "2025-10-01",
            isUsed: false,
            isExpired: true,
        },
    ];

    const [couponCode, setCouponCode] = useState("");
    const [registerMessage, setRegisterMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);

    const availableCoupons = mockCoupons.filter((c) => !c.isUsed && !c.isExpired);
    const usedCoupons = mockCoupons.filter((c) => c.isUsed);
    const expiredCoupons = mockCoupons.filter((c) => c.isExpired && !c.isUsed);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(date);
    };

    const getDiscountText = (coupon: Coupon) => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountValue}%`;
        } else {
            return formatPrice(coupon.discountValue);
        }
    };

    const handleRegisterCoupon = () => {
        if (!couponCode.trim()) {
            setRegisterMessage({ text: "쿠폰 코드를 입력해주세요.", type: "error" });
            return;
        }

        // Mock registration
        setRegisterMessage({ text: "쿠폰이 등록되었습니다!", type: "success" });
        setCouponCode("");

        setTimeout(() => {
            setRegisterMessage(null);
        }, 3000);
    };

    const renderCouponCard = (coupon: Coupon) => {
        return (
            <Card
                key={coupon.id}
                className={`overflow-hidden ${
                    coupon.isUsed || coupon.isExpired ? "opacity-60" : ""
                }`}
            >
                <div className="flex">
                    {/* Left side - Discount value */}
                    <div
                        className={`flex items-center justify-center p-6 ${
                            coupon.isUsed || coupon.isExpired
                                ? "bg-muted"
                                : "bg-gradient-to-br from-primary to-cyan-500"
                        } text-primary-foreground min-w-[140px]`}
                    >
                        <div className="text-center">
                            <Ticket className="h-8 w-8 mx-auto mb-2" />
                            <div className="text-3xl font-bold">{getDiscountText(coupon)}</div>
                            <div className="text-xs mt-1 opacity-90">
                                {coupon.discountType === "percentage" ? "할인" : "즉시할인"}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Coupon details */}
                    <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{coupon.name}</h3>
                                <p className="text-sm text-muted-foreground">{coupon.description}</p>
                            </div>
                            {coupon.isUsed && (
                                <Badge variant="secondary">사용완료</Badge>
                            )}
                            {coupon.isExpired && (
                                <Badge variant="destructive">기간만료</Badge>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-medium">쿠폰코드:</span>
                                <code className="px-2 py-1 bg-muted rounded text-foreground font-mono">
                                    {coupon.code}
                                </code>
                            </div>

                            {coupon.minPurchaseAmount > 0 && (
                                <div className="text-muted-foreground">
                                    • 최소 주문금액: {formatPrice(coupon.minPurchaseAmount)}
                                </div>
                            )}

                            {coupon.maxDiscountAmount && (
                                <div className="text-muted-foreground">
                                    • 최대 할인금액: {formatPrice(coupon.maxDiscountAmount)}
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    유효기간: {formatDate(coupon.expiryDate)}까지
                                    {coupon.usedDate && ` (사용일: ${formatDate(coupon.usedDate)})`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <>
            <Head title="쿠폰함" />

            <MyPageLayout user={user} currentPage="coupons">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold mb-1">쿠폰함</h2>
                        <p className="text-muted-foreground">
                            보유 중인 쿠폰 {availableCoupons.length}장
                        </p>
                    </div>

                    {/* Coupon Registration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                쿠폰 등록
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="쿠폰 코드를 입력하세요"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleRegisterCoupon();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button onClick={handleRegisterCoupon}>등록하기</Button>
                            </div>

                            {registerMessage && (
                                <div
                                    className={`mt-3 flex items-center gap-2 text-sm ${
                                        registerMessage.type === "success"
                                            ? "text-green-600"
                                            : "text-destructive"
                                    }`}
                                >
                                    {registerMessage.type === "success" ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                    {registerMessage.text}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Coupon Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">
                                        {availableCoupons.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">사용 가능</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-muted-foreground mb-1">
                                        {usedCoupons.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">사용 완료</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-muted-foreground mb-1">
                                        {expiredCoupons.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">기간 만료</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coupon List */}
                    <Card>
                        <CardHeader>
                            <Tabs defaultValue="available">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="available">
                                        사용 가능 ({availableCoupons.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="used">
                                        사용 완료 ({usedCoupons.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="expired">
                                        기간 만료 ({expiredCoupons.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="available" className="mt-6">
                                    {availableCoupons.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-muted-foreground">
                                                사용 가능한 쿠폰이 없습니다
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {availableCoupons.map((coupon) => renderCouponCard(coupon))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="used" className="mt-6">
                                    {usedCoupons.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-muted-foreground">
                                                사용한 쿠폰이 없습니다
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {usedCoupons.map((coupon) => renderCouponCard(coupon))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="expired" className="mt-6">
                                    {expiredCoupons.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-muted-foreground">
                                                만료된 쿠폰이 없습니다
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {expiredCoupons.map((coupon) => renderCouponCard(coupon))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardHeader>
                    </Card>

                    {/* Help Info */}
                    <Card className="bg-muted/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                쿠폰 사용 안내
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>쿠폰은 결제 시 1개만 사용 가능합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        쿠폰별 최소 주문금액 및 최대 할인금액을 확인해주세요.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>유효기간이 지난 쿠폰은 사용할 수 없습니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        환불 시 사용한 쿠폰은 재발급되지 않을 수 있습니다.
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </MyPageLayout>
        </>
    );
}
