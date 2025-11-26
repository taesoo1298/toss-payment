import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft, CreditCard, User, Package, Receipt, XCircle, Clock } from 'lucide-react';

interface Payment {
    id: number;
    orderId: string;
    paymentKey: string | null;
    orderName: string;
    customerName: string;
    customerEmail: string;
    customerMobilePhone: string | null;
    method: string;
    methodLabel: string;
    status: string;
    statusLabel: string;
    requestedAt: string | null;
    approvedAt: string | null;
    canceledAt: string | null;
    totalAmount: number;
    balanceAmount: number;
    suppliedAmount: number;
    vat: number;
    taxFreeAmount: number;
    discountAmount: number;
    cancelAmount: number;
    currency: string;
    cardCompany: string | null;
    cardNumber: string | null;
    cardType: string | null;
    receiptUrl: string | null;
    failureCode: string | null;
    failureMessage: string | null;
    isCancelable: boolean;
    cancelableAmount: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    order?: {
        id: number;
        orderId: string;
        status: string;
        statusLabel: string;
        totalAmount: number;
        items: Array<{
            id: number;
            productName: string;
            quantity: number;
            price: number;
            subtotal: number;
        }>;
    };
    transactions?: Array<{
        id: number;
        type: string;
        amount: number;
        reason: string | null;
        processedAt: string | null;
        createdAt: string;
    }>;
}

interface Props {
    payment: Payment;
}

export default function PaymentShow({ payment }: Props) {
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelAmount, setCancelAmount] = useState(payment.cancelableAmount.toString());

    const handleCancel = () => {
        if (!confirm('정말 이 결제를 취소하시겠습니까?')) return;

        router.post(
            route('admin.payments.cancel', payment.id),
            {
                cancel_reason: cancelReason,
                cancel_amount: parseInt(cancelAmount),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCancelForm(false);
                    setCancelReason('');
                },
            }
        );
    };

    const formatAmount = (amount: number) => {
        return `₩${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getStatusBadge = (status: string, statusLabel: string) => {
        const variants: Record<string, { variant: any; className?: string }> = {
            done: { variant: 'default', className: 'bg-green-600' },
            pending: { variant: 'secondary' },
            ready: { variant: 'secondary' },
            in_progress: { variant: 'default', className: 'bg-blue-600' },
            waiting_for_deposit: { variant: 'default', className: 'bg-yellow-600' },
            canceled: { variant: 'outline' },
            partial_canceled: { variant: 'outline' },
            aborted: { variant: 'destructive' },
            expired: { variant: 'outline' },
        };
        const config = variants[status] || { variant: 'outline' };
        return <Badge variant={config.variant} className={config.className}>{statusLabel}</Badge>;
    };

    const getTransactionTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            payment: '결제',
            cancel: '전체취소',
            partial_cancel: '부분취소',
        };
        return labels[type] || type;
    };

    return (
        <AdminLayout header="결제 상세">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.payments.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                목록
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">결제 상세</h1>
                            <p className="mt-1 text-sm text-gray-500">주문번호: {payment.orderId}</p>
                        </div>
                    </div>
                    {payment.isCancelable && !showCancelForm && (
                        <Button variant="destructive" onClick={() => setShowCancelForm(true)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            결제 취소
                        </Button>
                    )}
                </div>

                {showCancelForm && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-base text-red-900">결제 취소</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>취소 금액</Label>
                                <Input
                                    type="number"
                                    value={cancelAmount}
                                    onChange={(e) => setCancelAmount(e.target.value)}
                                    max={payment.cancelableAmount}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    최대 취소 가능 금액: {formatAmount(payment.cancelableAmount)}
                                </p>
                            </div>
                            <div>
                                <Label>취소 사유</Label>
                                <Textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="취소 사유를 입력하세요"
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="destructive" onClick={handleCancel}>
                                    취소 처리
                                </Button>
                                <Button variant="outline" onClick={() => setShowCancelForm(false)}>
                                    닫기
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                결제 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">주문번호</div>
                                <div className="font-mono">{payment.orderId}</div>

                                <div className="text-gray-500">결제키</div>
                                <div className="font-mono text-xs break-all">{payment.paymentKey || '-'}</div>

                                <div className="text-gray-500">주문명</div>
                                <div>{payment.orderName}</div>

                                <div className="text-gray-500">결제수단</div>
                                <div>
                                    <Badge variant="outline">{payment.methodLabel}</Badge>
                                </div>

                                <div className="text-gray-500">결제상태</div>
                                <div>{getStatusBadge(payment.status, payment.statusLabel)}</div>

                                {payment.cardCompany && (
                                    <>
                                        <div className="text-gray-500">카드사</div>
                                        <div>{payment.cardCompany}</div>

                                        <div className="text-gray-500">카드번호</div>
                                        <div className="font-mono">{payment.cardNumber}</div>

                                        <div className="text-gray-500">카드종류</div>
                                        <div>{payment.cardType}</div>
                                    </>
                                )}

                                <div className="text-gray-500">요청일시</div>
                                <div className="text-xs">{formatDate(payment.requestedAt)}</div>

                                <div className="text-gray-500">승인일시</div>
                                <div className="text-xs">{formatDate(payment.approvedAt)}</div>

                                {payment.canceledAt && (
                                    <>
                                        <div className="text-gray-500">취소일시</div>
                                        <div className="text-xs">{formatDate(payment.canceledAt)}</div>
                                    </>
                                )}

                                {payment.receiptUrl && (
                                    <>
                                        <div className="text-gray-500">영수증</div>
                                        <div>
                                            <a
                                                href={payment.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-xs"
                                            >
                                                영수증 보기
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                고객 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">고객명</div>
                                <div>{payment.customerName}</div>

                                <div className="text-gray-500">이메일</div>
                                <div className="text-xs break-all">{payment.customerEmail}</div>

                                <div className="text-gray-500">전화번호</div>
                                <div>{payment.customerMobilePhone || '-'}</div>

                                {payment.user && (
                                    <>
                                        <div className="text-gray-500">회원정보</div>
                                        <div>
                                            <Link
                                                href={route('admin.users.show', payment.user.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {payment.user.name} ({payment.user.email})
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            금액 상세
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">공급가액</span>
                                <span>{formatAmount(payment.suppliedAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">부가세 (VAT)</span>
                                <span>{formatAmount(payment.vat)}</span>
                            </div>
                            {payment.taxFreeAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">면세금액</span>
                                    <span>{formatAmount(payment.taxFreeAmount)}</span>
                                </div>
                            )}
                            {payment.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>할인금액</span>
                                    <span>-{formatAmount(payment.discountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>총 결제금액</span>
                                <span>{formatAmount(payment.totalAmount)}</span>
                            </div>
                            {payment.cancelAmount > 0 && (
                                <>
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>취소금액</span>
                                        <span>-{formatAmount(payment.cancelAmount)}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold text-green-600">
                                        <span>잔액</span>
                                        <span>{formatAmount(payment.balanceAmount)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {payment.order && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                주문 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">주문번호: {payment.order.orderId}</div>
                                        <div className="text-sm text-gray-500">
                                            상태: <Badge variant="outline">{payment.order.statusLabel}</Badge>
                                        </div>
                                    </div>
                                    <Link href={route('admin.orders.show', payment.order.id)}>
                                        <Button variant="outline" size="sm">
                                            주문 상세
                                        </Button>
                                    </Link>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="font-medium mb-2">주문 상품</div>
                                    <div className="space-y-2">
                                        {payment.order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>{item.productName} × {item.quantity}</span>
                                                <span>{formatAmount(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {payment.transactions && payment.transactions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                거래 내역
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {payment.transactions.map((transaction) => (
                                    <div key={transaction.id} className="border-l-2 border-gray-300 pl-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium">
                                                    {getTransactionTypeLabel(transaction.type)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(transaction.processedAt || transaction.createdAt)}
                                                </div>
                                                {transaction.reason && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        사유: {transaction.reason}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`font-bold ${transaction.type.includes('cancel') ? 'text-red-600' : 'text-green-600'}`}>
                                                {transaction.type.includes('cancel') ? '-' : '+'}{formatAmount(transaction.amount)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {payment.failureCode && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-900">결제 실패 정보</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">오류 코드:</span> {payment.failureCode}
                                </div>
                                <div>
                                    <span className="font-medium">오류 메시지:</span> {payment.failureMessage}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
