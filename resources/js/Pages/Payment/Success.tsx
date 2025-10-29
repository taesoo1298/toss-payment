import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Receipt, Home, Loader2 } from "lucide-react";

interface PaymentData {
    order_id: string;
    order_name: string;
    amounts: {
        total: number;
    };
    method: {
        label: string;
    };
    approved_at: string;
    receipt_url?: string;
}

interface SuccessProps {
    paymentKey?: string;
    orderId?: string;
    amount?: string;
}

export default function Success({ paymentKey, orderId, amount }: SuccessProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

    useEffect(() => {
        const confirmPayment = async () => {
            if (!paymentKey || !orderId || !amount) {
                setError('결제 정보가 올바르지 않습니다.');
                setLoading(false);
                return;
            }

            try {
                const response = await window.axios.post('/api/payments/confirm', {
                    payment_key: paymentKey,
                    order_id: orderId,
                    amount: parseInt(amount),
                });

                if (!response.data.success) {
                    throw new Error(response.data.message || '결제 승인에 실패했습니다.');
                }

                setPaymentData(response.data.data);

                // Redirect to order complete page after successful confirmation
                setTimeout(() => {
                    router.visit(`/order/complete?orderId=${orderId}&paymentKey=${paymentKey}&amount=${amount}`);
                }, 1500);
            } catch (err: any) {
                console.error('결제 승인 오류:', err);
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        '결제 확인 중 오류가 발생했습니다.'
                );
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [paymentKey, orderId, amount]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <>
            <Head title="결제 완료" />

            <div className="min-h-screen py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {loading && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-12">
                                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                                    <p className="text-muted-foreground">결제를 확인하는 중입니다...</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!loading && !error && paymentData && (
                        <div className="space-y-6">
                            {/* Success Header */}
                            <Card>
                                <CardHeader>
                                    <div className="text-center space-y-4">
                                        <div className="flex justify-center">
                                            <div className="rounded-full bg-green-100 p-3">
                                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <CardTitle className="text-3xl text-green-600">
                                                결제가 완료되었습니다
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                결제가 정상적으로 처리되었습니다
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Payment Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>결제 정보</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-muted-foreground font-medium">주문번호</span>
                                            <span className="font-semibold">
                                                {paymentData.order_id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-muted-foreground font-medium">상품명</span>
                                            <span className="font-semibold">
                                                {paymentData.order_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-muted-foreground font-medium">결제 금액</span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(paymentData.amounts.total)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-muted-foreground font-medium">결제 수단</span>
                                            <span className="font-semibold">
                                                {paymentData.method.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-3">
                                            <span className="text-muted-foreground font-medium">결제 시각</span>
                                            <span className="font-semibold">
                                                {formatDate(paymentData.approved_at)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center flex-wrap">
                                {paymentData.receipt_url && (
                                    <Button asChild size="lg">
                                        <a
                                            href={paymentData.receipt_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Receipt className="mr-2 h-4 w-4" />
                                            영수증 보기
                                        </a>
                                    </Button>
                                )}
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/dashboard">
                                        <Home className="mr-2 h-4 w-4" />
                                        대시보드
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="text-center space-y-4">
                                        <div className="flex justify-center">
                                            <div className="rounded-full bg-red-100 p-3">
                                                <AlertCircle className="h-12 w-12 text-red-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <CardTitle className="text-3xl text-red-600">
                                                결제 확인 실패
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                결제 확인 중 문제가 발생했습니다
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>

                            <div className="flex justify-center">
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        홈으로
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
