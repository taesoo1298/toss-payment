import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { PageProps } from "@/types";

// Declare TossPayments global from CDN
declare global {
    interface Window {
        TossPayments: any;
    }
}

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CheckoutProps extends PageProps {
    items?: OrderItem[];
    totalAmount?: number;
}

export default function Checkout({ auth, items, totalAmount }: CheckoutProps) {
    const user = auth.user;

    // Mock order items
    const mockItems: OrderItem[] = items || [
        {
            id: 1,
            name: 'Dr.Smile 미백 치약 프로',
            price: 18900,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
        },
        {
            id: 2,
            name: 'Dr.Smile 잇몸케어 치약',
            price: 16900,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
        },
    ];

    const productTotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = productTotal >= 30000 ? 0 : 3000;
    const finalTotal = productTotal + shippingFee;

    const [formData, setFormData] = useState({
        // 주문자 정보
        customer_name: user?.name || "",
        customer_email: user?.email || "",
        customer_mobile_phone: "",

        // 배송 정보
        recipient_name: user?.name || "",
        recipient_phone: "",
        postal_code: "",
        address: "",
        address_detail: "",
        delivery_message: "",

        // 주문 정보
        order_name: mockItems.length > 1
            ? `${mockItems[0].name} 외 ${mockItems.length - 1}건`
            : mockItems[0].name,
        amount: finalTotal,
    });

    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: "error" | "success";
    } | null>(null);

    const paymentWidgetRef = useRef<any>(null);
    const paymentMethodsWidgetRef = useRef<any>(null);

    const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

    // Initialize payment widget
    useEffect(() => {
        const initializeWidget = async () => {
            if (!TOSS_CLIENT_KEY) {
                setMessage({
                    text: "결제 설정이 올바르지 않습니다. 관리자에게 문의하세요.",
                    type: "error",
                });
                return;
            }

            if (!window.TossPayments) {
                setMessage({
                    text: "Toss Payments SDK가 로드되지 않았습니다.",
                    type: "error",
                });
                return;
            }

            try {
                const tossPayments = await window.TossPayments(TOSS_CLIENT_KEY);
                const customerKey = user?.id ? `user-${user.id}` : `guest-${Date.now()}`;
                const paymentWidget = tossPayments.widgets({ customerKey });

                paymentWidgetRef.current = paymentWidget;

                await paymentWidget.setAmount({
                    currency: "KRW",
                    value: formData.amount,
                });

                const paymentMethodsWidget = paymentWidget.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                });

                paymentMethodsWidgetRef.current = paymentMethodsWidget;

                await paymentWidget.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                });
            } catch (error: any) {
                console.error("위젯 초기화 오류:", error);
                setMessage({
                    text: "결제 위젯 초기화에 실패했습니다.",
                    type: "error",
                });
            }
        };

        initializeWidget();
    }, [TOSS_CLIENT_KEY, user]);

    // Update amount when total changes
    useEffect(() => {
        if (paymentWidgetRef.current) {
            paymentWidgetRef.current.setAmount({
                currency: "KRW",
                value: formData.amount,
            });
        }
    }, [formData.amount]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(price);
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setProcessing(true);

        try {
            // Step 1: Prepare payment
            const response = await window.axios.post("/api/payments/prepare", {
                ...formData,
                method: "card",
            });

            if (!response.data.success) {
                throw new Error("결제 준비 실패");
            }

            const { data } = response.data;

            // Step 2: Request payment
            await paymentWidgetRef.current?.requestPayment({
                orderId: data.order_id,
                orderName: formData.order_name,
                successUrl: `${window.location.origin}/payments/success`,
                failUrl: `${window.location.origin}/payments/fail`,
                customerEmail: formData.customer_email,
                customerName: formData.customer_name,
                customerMobilePhone: formData.customer_mobile_phone,
            });
        } catch (error: any) {
            console.error("결제 오류:", error);
            setMessage({
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "결제 처리 중 오류가 발생했습니다.",
                type: "error",
            });
            setProcessing(false);
        }
    };

    const handleAddressSearch = () => {
        // 주소 검색 API 연동 (예: Daum 우편번호 서비스)
        alert("주소 검색 기능은 별도로 구현해야 합니다.");
    };

    return (
        <>
            <Head title="주문/결제" />

            <div className="min-h-screen bg-background">
                <Header user={user} />

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-[1200px] mx-auto">
                        <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

                        {message && (
                            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
                                {message.type === "error" ? (
                                    <AlertCircle className="h-4 w-4" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                <AlertDescription>{message.text}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* 주문 상품 */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ShoppingBag className="h-5 w-5" />
                                                주문 상품
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {mockItems.map((item) => (
                                                    <div key={item.id} className="flex gap-4">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-20 h-20 object-cover rounded-lg border"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">{item.name}</h4>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-muted-foreground">
                                                                    수량: {item.quantity}개
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

                                    {/* 주문자 정보 */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>주문자 정보</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="customer_name">이름 *</Label>
                                                    <Input
                                                        id="customer_name"
                                                        value={formData.customer_name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, customer_name: e.target.value })
                                                        }
                                                        placeholder="홍길동"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="customer_mobile_phone">휴대폰 번호 *</Label>
                                                    <Input
                                                        id="customer_mobile_phone"
                                                        type="tel"
                                                        value={formData.customer_mobile_phone}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                customer_mobile_phone: e.target.value,
                                                            })
                                                        }
                                                        placeholder="01012345678"
                                                        pattern="01[0-9]{8,9}"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_email">이메일 *</Label>
                                                <Input
                                                    id="customer_email"
                                                    type="email"
                                                    value={formData.customer_email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, customer_email: e.target.value })
                                                    }
                                                    placeholder="example@email.com"
                                                    required
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 배송 정보 */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Truck className="h-5 w-5" />
                                                배송 정보
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="recipient_name">받는 사람 *</Label>
                                                    <Input
                                                        id="recipient_name"
                                                        value={formData.recipient_name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, recipient_name: e.target.value })
                                                        }
                                                        placeholder="홍길동"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="recipient_phone">휴대폰 번호 *</Label>
                                                    <Input
                                                        id="recipient_phone"
                                                        type="tel"
                                                        value={formData.recipient_phone}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, recipient_phone: e.target.value })
                                                        }
                                                        placeholder="01012345678"
                                                        pattern="01[0-9]{8,9}"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="postal_code">우편번호 *</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="postal_code"
                                                        value={formData.postal_code}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, postal_code: e.target.value })
                                                        }
                                                        placeholder="12345"
                                                        required
                                                        readOnly
                                                    />
                                                    <Button type="button" variant="outline" onClick={handleAddressSearch}>
                                                        주소 검색
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address">주소 *</Label>
                                                <Input
                                                    id="address"
                                                    value={formData.address}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, address: e.target.value })
                                                    }
                                                    placeholder="기본 주소"
                                                    required
                                                    readOnly
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address_detail">상세 주소 *</Label>
                                                <Input
                                                    id="address_detail"
                                                    value={formData.address_detail}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, address_detail: e.target.value })
                                                    }
                                                    placeholder="상세 주소를 입력하세요"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="delivery_message">배송 메시지</Label>
                                                <Input
                                                    id="delivery_message"
                                                    value={formData.delivery_message}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, delivery_message: e.target.value })
                                                    }
                                                    placeholder="배송 시 요청사항을 입력하세요"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 결제 수단 */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                결제 수단
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div id="payment-method" className="w-full min-h-[300px]" />
                                        </CardContent>
                                    </Card>

                                    {/* 약관 동의 */}
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div id="agreement" className="w-full" />
                                        </CardContent>
                                    </Card>

                                    {/* 결제 버튼 */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-14 text-lg font-semibold"
                                        disabled={processing}
                                    >
                                        {processing ? "처리 중..." : `${formatPrice(finalTotal)} 결제하기`}
                                    </Button>
                                </form>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-24">
                                    <CardHeader>
                                        <CardTitle>결제 금액</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2 pb-4 border-b">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">상품 금액</span>
                                                <span className="font-medium">{formatPrice(productTotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">배송비</span>
                                                <span className="font-medium">
                                                    {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-lg font-semibold">최종 결제금액</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {formatPrice(finalTotal)}
                                            </span>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                                            <div className="font-medium text-blue-900 mb-2">결제 안내</div>
                                            <ul className="space-y-1 text-blue-800 text-xs">
                                                <li>• 안전한 결제를 위해 Toss Payments를 이용합니다</li>
                                                <li>• 결제 완료 후 영수증을 이메일로 발송해드립니다</li>
                                                <li>• 주문 후 취소/변경은 고객센터로 문의해주세요</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
