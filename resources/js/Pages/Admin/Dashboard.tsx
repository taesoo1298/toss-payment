import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";
import { Package, ShoppingCart, Users, HelpCircle, Bell } from "lucide-react";

interface Stats {
    total_users: number;
    total_orders: number;
    pending_inquiries: number;
    total_faqs: number;
    total_notices: number;
}

interface RecentOrder {
    id: number;
    order_number: string;
    user_name: string;
    total: number;
    status: string;
    created_at: string;
}

interface PendingInquiry {
    id: number;
    user_name: string;
    category: string;
    subject: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentOrders: RecentOrder[];
    pendingInquiries: PendingInquiry[];
}

export default function Dashboard({
    stats,
    recentOrders,
    pendingInquiries,
}: Props) {
    const statCards = [
        {
            name: "총 회원",
            value: stats.total_users.toLocaleString(),
            icon: Users,
            href: route("admin.users.index"),
            color: "bg-blue-500",
        },
        {
            name: "총 주문",
            value: stats.total_orders.toLocaleString(),
            icon: ShoppingCart,
            href: route("admin.orders.index"),
            color: "bg-green-500",
        },
        {
            name: "대기 문의",
            value: stats.pending_inquiries.toLocaleString(),
            icon: HelpCircle,
            href: route("admin.inquiries.index"),
            color: "bg-orange-500",
        },
        {
            name: "FAQ",
            value: stats.total_faqs.toLocaleString(),
            icon: Package,
            href: route("admin.faqs.index"),
            color: "bg-purple-500",
        },
        {
            name: "공지사항",
            value: stats.total_notices.toLocaleString(),
            icon: Bell,
            href: route("admin.notices.index"),
            color: "bg-pink-500",
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            pending: { label: "대기", color: "bg-yellow-100 text-yellow-800" },
            processing: { label: "처리중", color: "bg-blue-100 text-blue-800" },
            completed: { label: "완료", color: "bg-green-100 text-green-800" },
            cancelled: { label: "취소", color: "bg-red-100 text-red-800" },
        };

        const statusInfo = statusMap[status] || {
            label: status,
            color: "bg-gray-100 text-gray-800",
        };

        return (
            <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusInfo.color}`}
            >
                {statusInfo.label}
            </span>
        );
    };

    return (
        <AdminLayout header="대시보드">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        관리자 대시보드
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Dr.Smile 전자상거래 관리 시스템
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={stat.name}
                                href={stat.href}
                                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow"
                            >
                                <dt>
                                    <div
                                        className={`absolute rounded-md ${stat.color} p-3`}
                                    >
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                        {stat.name}
                                    </p>
                                </dt>
                                <dd className="ml-16 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stat.value}
                                    </p>
                                </dd>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                최근 주문
                            </h2>
                        </div>
                        <div className="p-6">
                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={route(
                                                "admin.orders.show",
                                                order.id
                                            )}
                                            className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {order.user_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {order.created_at}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                    <p className="mt-2 text-sm font-semibold text-gray-900">
                                                        ₩
                                                        {order?.total?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    최근 주문이 없습니다.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pending Inquiries */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                대기 중인 문의
                            </h2>
                        </div>
                        <div className="p-6">
                            {pendingInquiries.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingInquiries.map((inquiry) => (
                                        <Link
                                            key={inquiry.id}
                                            href={route(
                                                "admin.inquiries.show",
                                                inquiry.id
                                            )}
                                            className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                            {inquiry.category}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 font-medium text-gray-900 line-clamp-1">
                                                        {inquiry.subject}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {inquiry.user_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {inquiry.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    대기 중인 문의가 없습니다.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg bg-white shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        빠른 작업
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Link
                            href={route("admin.faqs.create")}
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    FAQ 등록
                                </span>
                            </div>
                        </Link>

                        <Link
                            href={route("admin.notices.create")}
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    공지사항 등록
                                </span>
                            </div>
                        </Link>

                        <Link
                            href={route("admin.inquiries.index")}
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    문의 관리
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
