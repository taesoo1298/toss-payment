import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { Package, ShoppingCart, Users, CreditCard } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        {
            name: '총 상품',
            value: '0',
            icon: Package,
            href: route('admin.products.index'),
            color: 'bg-blue-500',
        },
        {
            name: '총 주문',
            value: '0',
            icon: ShoppingCart,
            href: '#',
            color: 'bg-green-500',
        },
        {
            name: '총 회원',
            value: '0',
            icon: Users,
            href: '#',
            color: 'bg-purple-500',
        },
        {
            name: '총 매출',
            value: '₩0',
            icon: CreditCard,
            href: '#',
            color: 'bg-orange-500',
        },
    ];

    return (
        <AdminLayout header="대시보드">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
                    <p className="mt-1 text-sm text-gray-500">Dr.Smile 전자상거래 관리 시스템</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={stat.name}
                                href={stat.href}
                                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow"
                            >
                                <dt>
                                    <div className={`absolute rounded-md ${stat.color} p-3`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                        {stat.name}
                                    </p>
                                </dt>
                                <dd className="ml-16 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                </dd>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg bg-white shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href={route('admin.products.create')}
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    상품 등록
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    주문 관리
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    회원 관리
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                            <div>
                                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    결제 내역
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="rounded-lg bg-blue-50 p-6">
                    <h3 className="text-lg font-medium text-blue-900">환영합니다!</h3>
                    <p className="mt-2 text-sm text-blue-700">
                        Dr.Smile 관리자 페이지입니다. 왼쪽 사이드바에서 각 메뉴를 선택하여 시스템을 관리하세요.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
