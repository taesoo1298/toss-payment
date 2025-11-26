import { Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
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
    Search,
    Eye,
    ShoppingCart,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    DollarSign,
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
    canCancel: boolean;
    canRefund: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Statistics {
    total: number;
    pending: number;
    preparing: number;
    shipping: number;
    delivered: number;
    cancelled: number;
    refunded: number;
    total_amount: number;
}

interface Props {
    orders: {
        data: Order[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
    statistics: Statistics;
}

export default function OrdersIndex({ orders, filters, statistics }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        const params: any = { search };
        Object.entries(selectedFilters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        router.get(route('admin.orders.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedFilters({
            status: '',
            date_from: '',
            date_to: '',
        });
        router.get(route('admin.orders.index'));
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('admin.orders.index'),
            { ...filters, search, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
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
        <AdminLayout header="주문 관리">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            전체 {orders.meta.total}개의 주문
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">전체 주문</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                총 매출 ₩{statistics.total_amount.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">처리중</CardTitle>
                            <Package className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {statistics.pending + statistics.preparing}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                주문완료 {statistics.pending} / 상품준비 {statistics.preparing}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">배송중</CardTitle>
                            <Truck className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {statistics.shipping}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">배송 진행중</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">완료/취소</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.delivered + statistics.cancelled + statistics.refunded}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                완료 {statistics.delivered} / 취소·환불{' '}
                                {statistics.cancelled + statistics.refunded}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">검색 및 필터</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="search"
                                    placeholder="주문번호, 고객명, 이메일, 전화번호로 검색..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    검색
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">주문 상태</label>
                                    <Select
                                        value={selectedFilters.status || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('status', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
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

                                <div>
                                    <label className="text-sm font-medium mb-2 block">시작 날짜</label>
                                    <Input
                                        type="date"
                                        value={selectedFilters.date_from}
                                        onChange={(e) => {
                                            handleFilterChange('date_from', e.target.value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">종료 날짜</label>
                                    <Input
                                        type="date"
                                        value={selectedFilters.date_to}
                                        onChange={(e) => {
                                            handleFilterChange('date_to', e.target.value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    필터 초기화
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>주문번호</TableHead>
                                <TableHead>고객명</TableHead>
                                <TableHead>상품정보</TableHead>
                                <TableHead className="text-right">결제금액</TableHead>
                                <TableHead className="text-center">주문상태</TableHead>
                                <TableHead>주문일시</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-32 text-gray-500">
                                        주문 내역이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={route('admin.orders.show', order.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {order.orderId}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">{order.customerName}</div>
                                                <div className="text-xs text-gray-500">
                                                    {order.customerEmail}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {order.items.length > 0 && (
                                                    <div>
                                                        {order.items[0].productName}
                                                        {order.items.length > 1 && (
                                                            <span className="text-gray-500">
                                                                {' '}
                                                                외 {order.items.length - 1}건
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₩{order.totalAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusBadgeVariant(order.statusColor)}>
                                                {order.statusLabel}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.orders.show', order.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {orders.meta.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {orders.meta.current_page} of {orders.meta.last_page} (총{' '}
                            {orders.meta.total}개)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(orders.meta.current_page - 1)}
                                disabled={orders.meta.current_page === 1}
                            >
                                이전
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(orders.meta.current_page + 1)}
                                disabled={orders.meta.current_page === orders.meta.last_page}
                            >
                                다음
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
