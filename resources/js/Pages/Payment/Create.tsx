import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react";

// Declare TossPayments global from CDN
declare global {
    interface Window {
        TossPayments: any;
    }
}

interface PaymentFormData {
    order_name: string;
    amount: number;
    customer_name: string;
    customer_email: string;
    customer_mobile_phone: string;
}

export default function Create(props: any) {
    const user = props.auth.user;
    const [formData, setFormData] = useState<PaymentFormData>({
        order_name: "테스트 상품",
        amount: 10000,
        customer_name: user?.name || "홍길동",
        customer_email: user?.email || "test@example.com",
        customer_mobile_phone: "01012345678",
    });
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: "error" | "success";
    } | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    const paymentWidgetRef = useRef<any>(null);
    const paymentMethodsWidgetRef = useRef<any>(null);

    const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

    // Initialize payment widget on mount
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

                // Create payment widget with customer key (user ID or unique identifier)
                const customerKey =
                    `user-${user?.id?.toString()}` || `guest-${Date.now()}`;
                const paymentWidget = tossPayments.widgets({ customerKey });

                paymentWidgetRef.current = paymentWidget;

                await paymentWidget.setAmount({
                    currency: "KRW",
                    value: formData.amount,
                });

                // Render payment methods widget
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    {
                        selector: "#payment-method",
                        variantKey: "DEFAULT",
                    }
                );

                paymentMethodsWidgetRef.current = paymentMethodsWidget;

                // Render agreement terms
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

    // Update amount when form data changes
    useEffect(() => {
        if (paymentMethodsWidgetRef.current) {
            paymentMethodsWidgetRef.current.updateAmount(
                formData.amount,
                paymentMethodsWidgetRef.current.UPDATE_REASON.COUPON
            );
        }
    }, [formData.amount]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setProcessing(true);

        try {
            // Step 1: Prepare payment (create order in backend)
            const response = await window.axios.post("/api/payments/prepare", {
                ...formData,
                method: "card", // v2에서는 위젯에서 선택됨
            });

            if (!response.data.success) {
                throw new Error("결제 준비 실패");
            }

            const { data } = response.data;
            setOrderId(data.order_id);

            // Step 2: Request payment using widget
            await paymentWidgetRef.current?.requestPayment({
                orderId: data.order_id,
                orderName: data.order_name,
                successUrl: `${window.location.origin}/payments/success`,
                failUrl: `${window.location.origin}/payments/fail`,
                customerEmail: data.customer_email,
                customerName: data.customer_name,
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

    return (
        <>
            <Head title="Toss Payments 결제" />

            <div className="min-h-screen py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="text-3xl">Toss Payments 결제</CardTitle>
                                    <CardDescription className="mt-2">
                                        안전하고 빠른 결제를 위해 정보를 입력해주세요
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Error/Success Messages */}
                    {message && (
                        <Alert variant={message.type === "error" ? "destructive" : "default"}>
                            {message.type === "error" ? (
                                <AlertCircle className="h-4 w-4" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4" />
                            )}
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    )}

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product & Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>주문 정보</CardTitle>
                                <CardDescription>결제할 상품과 구매자 정보를 입력하세요</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Product Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="order_name">상품명</Label>
                                        <Input
                                            id="order_name"
                                            value={formData.order_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    order_name: e.target.value,
                                                })
                                            }
                                            placeholder="구매하실 상품명을 입력하세요"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">결제 금액 (원)</Label>
                                        <Input
                                            type="number"
                                            id="amount"
                                            value={formData.amount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    amount: parseInt(e.target.value) || 0,
                                                })
                                            }
                                            min={100}
                                            placeholder="10000"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer_name">구매자명</Label>
                                        <Input
                                            id="customer_name"
                                            value={formData.customer_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    customer_name: e.target.value,
                                                })
                                            }
                                            placeholder="홍길동"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customer_email">이메일</Label>
                                        <Input
                                            type="email"
                                            id="customer_email"
                                            value={formData.customer_email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    customer_email: e.target.value,
                                                })
                                            }
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customer_mobile_phone">휴대폰 번호</Label>
                                    <Input
                                        type="tel"
                                        id="customer_mobile_phone"
                                        value={formData.customer_mobile_phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customer_mobile_phone: e.target.value,
                                            })
                                        }
                                        pattern="01[0-9]{8,9}"
                                        placeholder="01012345678"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Widget */}
                        <Card>
                            <CardHeader>
                                <CardTitle>결제 수단</CardTitle>
                                <CardDescription>원하시는 결제 수단을 선택하세요</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div id="payment-method" className="w-full min-h-[300px]" />
                            </CardContent>
                        </Card>

                        {/* Agreement */}
                        <Card>
                            <CardHeader>
                                <CardTitle>약관 동의</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div id="agreement" className="w-full" />
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? "처리 중..." : "결제하기"}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
