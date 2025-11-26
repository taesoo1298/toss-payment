import { Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Search, Trash2, Ticket, CheckCircle, XCircle } from 'lucide-react';

interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string | null;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount: number;
    maxDiscountAmount: number | null;
    usageLimit: number | null;
    usageCount: number;
    validFrom: string | null;
    validUntil: string | null;
    isActive: boolean;
    status: string;
    createdAt: string;
}

interface Props {
    coupons: {
        data: Coupon[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        is_active?: string;
    };
    statistics: {
        total: number;
        active: number;
        inactive: number;
    };
}

export default function CouponsIndex({ coupons, filters, statistics }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('admin.coupons.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (coupon: Coupon) => {
        if (confirm(`"${coupon.name}" 쿠폰을 삭제하시겠습니까?`)) {
            router.delete(route('admin.coupons.destroy', coupon.id), {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; variant: any; className?: string }> = {
            active: { label: '사용 가능', variant: 'default', className: 'bg-green-600' },
            expired: { label: '기간 만료', variant: 'secondary' },
            sold_out: { label: '소진', variant: 'secondary' },
            inactive: { label: '비활성', variant: 'outline' },
        };
        const badge = badges[status] || { label: status, variant: 'outline' };
        return <Badge variant={badge.variant} className={badge.className}>{badge.label}</Badge>;
    };

    return (
        <AdminLayout header="쿠폰 관리">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">쿠폰 관리</h1>
                        <p className="mt-1 text-sm text-gray-500">전체 {coupons.meta.total}개의 쿠폰</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">전체 쿠폰</CardTitle>
                            <Ticket className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">활성 쿠폰</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">비활성 쿠폰</CardTitle>
                            <XCircle className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{statistics.inactive}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">검색</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                type="search"
                                placeholder="쿠폰 코드, 이름으로 검색..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">
                                <Search className="h-4 w-4 mr-2" />
                                검색
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>쿠폰 코드</TableHead>
                                <TableHead>쿠폰명</TableHead>
                                <TableHead>할인</TableHead>
                                <TableHead className="text-center">사용/제한</TableHead>
                                <TableHead>유효 기간</TableHead>
                                <TableHead className="text-center">상태</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-32 text-gray-500">
                                        등록된 쿠폰이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coupons.data.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                        <TableCell>{coupon.name}</TableCell>
                                        <TableCell>
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}%`
                                                : `₩${coupon.discountValue.toLocaleString()}`}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {coupon.usageCount} / {coupon.usageLimit || '∞'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {coupon.validFrom && new Date(coupon.validFrom).toLocaleDateString('ko-KR')}
                                            {' ~ '}
                                            {coupon.validUntil && new Date(coupon.validUntil).toLocaleDateString('ko-KR')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(coupon.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(coupon)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
