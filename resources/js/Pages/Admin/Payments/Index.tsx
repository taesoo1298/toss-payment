import { Link, router } from "@inertiajs/react";
import { useState, FormEvent } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Search,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    DollarSign,
    TrendingUp,
} from "lucide-react";

interface Payment {
    id: number;
    orderId: string;
    paymentKey: string | null;
    orderName: string;
    customerName: string;
    customerEmail: string;
    method: string;
    methodLabel: string;
    status: string;
    statusLabel: string;
    totalAmount: number;
    balanceAmount: number;
    cancelAmount: number;
    approvedAt: string | null;
    createdAt: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    payments: {
        data: Payment[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        status?: string;
        method?: string;
        date_from?: string;
        date_to?: string;
    };
    statistics: {
        total: number;
        completed: number;
        completed_amount: number;
        pending: number;
        failed: number;
        canceled: number;
        canceled_amount: number;
        today: number;
        today_amount: number;
    };
}

export default function PaymentsIndex({
    payments,
    filters,
    statistics,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [method, setMethod] = useState(filters.method || "");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.payments.index"),
            {
                search,
                status: status || undefined,
                method: method || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route("admin.payments.index"),
            { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const getStatusBadge = (status: string, statusLabel: string) => {
        const variants: Record<string, { variant: any; className?: string }> = {
            done: { variant: "default", className: "bg-green-600" },
            pending: { variant: "secondary" },
            ready: { variant: "secondary" },
            in_progress: { variant: "default", className: "bg-blue-600" },
            waiting_for_deposit: {
                variant: "default",
                className: "bg-yellow-600",
            },
            canceled: { variant: "outline" },
            partial_canceled: { variant: "outline" },
            aborted: { variant: "destructive" },
            expired: { variant: "outline" },
        };
        const config = variants[status] || { variant: "outline" };
        return (
            <Badge variant={config.variant} className={config.className}>
                {statusLabel}
            </Badge>
        );
    };

    const getMethodBadge = (methodLabel: string) => {
        return <Badge variant="outline">{methodLabel}</Badge>;
    };

    const formatAmount = (amount: number) => {
        return `₩${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminLayout header="결제 관리">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            결제 관리
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            전체 {payments.meta.total}건의 결제
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                전체 결제
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.total.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                총 결제 건수
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                결제 완료
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.completed.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatAmount(statistics.completed_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                오늘의 결제
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {statistics.today.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatAmount(statistics.today_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                결제 대기
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {statistics.pending.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                실패: {statistics.failed}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            검색 및 필터
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="search"
                                    placeholder="주문번호, 결제키, 고객명, 이메일로 검색..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    검색
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        결제 상태
                                    </label>
                                    <Select
                                        value={status || "all"}
                                        onValueChange={(value) => {
                                            const newValue =
                                                value === "all" ? "" : value;
                                            setStatus(newValue);
                                            handleFilterChange(
                                                "status",
                                                newValue
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                전체
                                            </SelectItem>
                                            <SelectItem value="done">
                                                결제 완료
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                결제 대기
                                            </SelectItem>
                                            <SelectItem value="ready">
                                                결제 준비 완료
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                결제 진행중
                                            </SelectItem>
                                            <SelectItem value="waiting_for_deposit">
                                                입금 대기
                                            </SelectItem>
                                            <SelectItem value="canceled">
                                                결제 취소
                                            </SelectItem>
                                            <SelectItem value="partial_canceled">
                                                부분 취소
                                            </SelectItem>
                                            <SelectItem value="aborted">
                                                결제 실패
                                            </SelectItem>
                                            <SelectItem value="expired">
                                                결제 만료
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        결제 수단
                                    </label>
                                    <Select
                                        value={method || "all"}
                                        onValueChange={(value) => {
                                            const newValue =
                                                value === "all" ? "" : value;
                                            setMethod(newValue);
                                            handleFilterChange(
                                                "method",
                                                newValue
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                전체
                                            </SelectItem>
                                            <SelectItem value="card">
                                                카드
                                            </SelectItem>
                                            <SelectItem value="virtual_account">
                                                가상계좌
                                            </SelectItem>
                                            <SelectItem value="transfer">
                                                계좌이체
                                            </SelectItem>
                                            <SelectItem value="easy_pay">
                                                간편결제
                                            </SelectItem>
                                            <SelectItem value="mobile_phone">
                                                휴대폰
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>주문번호</TableHead>
                                <TableHead>주문명</TableHead>
                                <TableHead>고객</TableHead>
                                <TableHead>결제수단</TableHead>
                                <TableHead className="text-right">
                                    금액
                                </TableHead>
                                <TableHead className="text-center">
                                    상태
                                </TableHead>
                                <TableHead>승인일시</TableHead>
                                <TableHead className="text-right">
                                    작업
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center h-32 text-gray-500"
                                    >
                                        결제 내역이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.data.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-xs">
                                            {payment.orderId}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {payment.orderName}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {payment.customerName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {payment.customerEmail}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getMethodBadge(
                                                payment.methodLabel
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-medium">
                                                {formatAmount(
                                                    payment.totalAmount
                                                )}
                                            </div>
                                            {payment.cancelAmount > 0 && (
                                                <div className="text-xs text-red-600">
                                                    취소:{" "}
                                                    {formatAmount(
                                                        payment.cancelAmount
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(
                                                payment.status,
                                                payment.statusLabel
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(payment.approvedAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.payments.show",
                                                        payment.id
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        상세
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {payments.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from(
                            { length: payments.meta.last_page },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Link
                                key={page}
                                href={route("admin.payments.index", {
                                    ...filters,
                                    page,
                                })}
                                preserveState
                                preserveScroll
                            >
                                <Button
                                    variant={
                                        page === payments.meta.current_page
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
