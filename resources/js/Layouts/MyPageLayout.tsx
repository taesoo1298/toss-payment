import { Link } from "@inertiajs/react";
import { User } from "@/types";
import Header from "@/Components/Header";
import { cn } from "@/lib/utils";
import {
    User as UserIcon,
    ShoppingBag,
    Heart,
    MapPin,
    CreditCard,
    Bell,
    Settings,
    HelpCircle,
    Ticket,
} from "lucide-react";

interface MyPageLayoutProps {
    user: User;
    children: React.ReactNode;
    currentPage?: string;
}

const menuItems = [
    {
        id: "dashboard",
        label: "마이페이지 홈",
        icon: UserIcon,
        href: "/mypage",
    },
    {
        id: "orders",
        label: "주문 내역",
        icon: ShoppingBag,
        href: "/mypage/orders",
    },
    {
        id: "wishlist",
        label: "찜한 상품",
        icon: Heart,
        href: "/mypage/wishlist",
    },
    {
        id: "addresses",
        label: "배송지 관리",
        icon: MapPin,
        href: "/mypage/addresses",
    },
    {
        id: "payments",
        label: "결제 수단",
        icon: CreditCard,
        href: "/mypage/payments",
    },
    {
        id: "coupons",
        label: "쿠폰함",
        icon: Ticket,
        href: "/mypage/coupons",
    },
    {
        id: "notifications",
        label: "알림 설정",
        icon: Bell,
        href: "/mypage/notifications",
    },
    {
        id: "settings",
        label: "계정 설정",
        icon: Settings,
        href: "/mypage/settings",
    },
    {
        id: "inquiry",
        label: "1:1 문의",
        icon: HelpCircle,
        href: "/customer-center/inquiry",
    },
];

export default function MyPageLayout({
    user,
    children,
    currentPage = "dashboard",
}: MyPageLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Header user={user} />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-[1200px] mx-auto">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
                        <p className="text-muted-foreground">
                            {user.name}님의 쇼핑 정보를 관리할 수 있습니다
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="lg:col-span-1">
                            <div className="bg-card border rounded-lg p-4 sticky top-24">
                                {/* User Info */}
                                <div className="pb-4 mb-4 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <nav className="space-y-1">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive =
                                            currentPage === item.id;

                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:col-span-3">{children}</main>
                    </div>
                </div>
            </div>
        </div>
    );
}
