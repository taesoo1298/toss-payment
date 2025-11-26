import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    Truck,
} from 'lucide-react';

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: number;
    subtotal: number;
}

interface Order {
    id: number;
    orderId: string;
    status: string;
    statusLabel: string;
    statusColor: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    recipientName: string;
    recipientPhone: string;
    postalCode: string;
    address: string;
    addressDetail: string | null;
    deliveryMemo: string | null;
    subtotal: number;
    shippingCost: number;
    couponDiscount: number;
    totalAmount: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    items: OrderItem[];
    coupon?: {
        id: number;
        code: string;
        name: string;
    };
    canCancel: boolean;
    canRefund: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    order: Order;
}

export default function OrderShow({ order }: Props) {
    const [status, setStatus] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusUpdate = () => {
        if (confirm('주문 상태를 변경하시겠습니까?')) {
            setIsUpdating(true);
            router.put(
                route('admin.orders.updateStatus', order.id),
                { status },
                {
                    preserveScroll: true,
                    onFinish: () => setIsUpdating(false),
                }
            );
        }
    };

    const getStatusBadgeVariant = (color: string) => {
        const variants: Record<string, any> = {
            blue: 'default',
            yellow: 'secondary',
            purple: 'outline',
            green: 'default',
            red: 'destructive',
            orange: 'secondary',
        };
        return variants[color] || 'default';
    };

    return (
        <AdminLayout header="주문 상세">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.orders.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                목록으로
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
                            <p className="mt-1 text-sm text-gray-500">주문번호: {order.orderId}</p>
                        </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.statusColor)} className="text-base px-4 py-2">
                        {order.statusLabel}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    주문 상품
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>상품명</TableHead>
                                            <TableHead className="text-right">단가</TableHead>
                                            <TableHead className="text-center">수량</TableHead>
                                            <TableHead className="text-right">소계</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {item.productImage ? (
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                                <Package className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium">
                                                                {item.productName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    ₩{item.price.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    ₩{item.subtotal.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    주문자 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">이름</span>
                                    <span className="col-span-2">{order.customerName}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">이메일</span>
                                    <span className="col-span-2">{order.customerEmail}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">전화번호</span>
                                    <span className="col-span-2">{order.customerPhone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    배송 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">받는 사람</span>
                                    <span className="col-span-2">{order.recipientName}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">연락처</span>
                                    <span className="col-span-2">{order.recipientPhone}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">우편번호</span>
                                    <span className="col-span-2">{order.postalCode}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">주소</span>
                                    <span className="col-span-2">
                                        {order.address}
                                        {order.addressDetail && `, ${order.addressDetail}`}
                                    </span>
                                </div>
                                {order.deliveryMemo && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-sm font-medium text-gray-500">배송 메모</span>
                                        <span className="col-span-2">{order.deliveryMemo}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Status Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    주문 상태 관리
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">상태 변경</label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">주문완료</SelectItem>
                                            <SelectItem value="preparing">상품준비중</SelectItem>
                                            <SelectItem value="shipping">배송중</SelectItem>
                                            <SelectItem value="delivered">배송완료</SelectItem>
                                            <SelectItem value="cancelled">취소</SelectItem>
                                            <SelectItem value="refunded">환불</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleStatusUpdate}
                                    disabled={status === order.status || isUpdating}
                                    className="w-full"
                                >
                                    {isUpdating ? '변경 중...' : '상태 변경'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Payment Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    결제 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">상품 금액</span>
                                    <span>₩{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">배송비</span>
                                    <span>₩{order.shippingCost.toLocaleString()}</span>
                                </div>
                                {order.couponDiscount > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span className="text-sm">쿠폰 할인</span>
                                        <span>-₩{order.couponDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                {order.coupon && (
                                    <div className="pt-2 border-t">
                                        <div className="text-xs text-gray-500">사용 쿠폰</div>
                                        <div className="text-sm font-medium">{order.coupon.name}</div>
                                        <div className="text-xs text-gray-400">{order.coupon.code}</div>
                                    </div>
                                )}
                                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                                    <span>최종 결제 금액</span>
                                    <span>₩{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">주문 정보</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">주문일시</span>
                                    <span>
                                        {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">최종 수정</span>
                                    <span>
                                        {new Date(order.updatedAt).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
