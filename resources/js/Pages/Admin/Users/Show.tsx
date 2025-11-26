import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    ArrowLeft,
    User,
    Mail,
    ShoppingCart,
    Calendar,
    Shield,
    Edit,
    Save,
    X,
} from "lucide-react";

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
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    provider: string | null;
    avatar: string | null;
    isAdmin: boolean;
    ordersCount: number;
    totalSpent: number;
    orders: Order[];
    createdAt: string;
    updatedAt: string;
}

interface Props {
    user: UserData;
}

export default function UserShow({ user }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        is_admin: user.isAdmin,
    });

    const handleSave = () => {
        router.put(route("admin.users.update", user.id), formData, {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (user.isAdmin) {
            alert("관리자 계정은 삭제할 수 없습니다.");
            return;
        }
        if (confirm(`"${user.name}" 회원을 삭제하시겠습니까?`)) {
            router.delete(route("admin.users.destroy", user.id));
        }
    };

    const getProviderBadge = (provider: string | null) => {
        if (!provider) return <Badge variant="outline">이메일</Badge>;

        const badges: Record<string, { label: string; variant: any }> = {
            google: { label: "Google", variant: "default" },
            kakao: { label: "Kakao", variant: "secondary" },
            naver: { label: "Naver", variant: "outline" },
        };

        const badge = badges[provider] || {
            label: provider,
            variant: "outline",
        };
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
    };

    const getStatusBadgeVariant = (color: string) => {
        const variants: Record<string, any> = {
            blue: "default",
            yellow: "secondary",
            purple: "outline",
            green: "default",
            red: "destructive",
            orange: "secondary",
        };
        return variants[color] || "default";
    };

    return (
        <AdminLayout header="회원 상세">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route("admin.users.index")}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                목록으로
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                회원 상세
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    수정
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={user.isAdmin}
                                >
                                    삭제
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    취소
                                </Button>
                                <Button onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" />
                                    저장
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    회원 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">이름</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                이메일
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="is_admin"
                                                checked={formData.is_admin}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        is_admin:
                                                            e.target.checked,
                                                    })
                                                }
                                                className="rounded"
                                            />
                                            <Label htmlFor="is_admin">
                                                관리자 권한
                                            </Label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-20 h-20 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-600">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xl font-bold">
                                                    {user.name}
                                                </div>
                                                <div className="text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    가입 방법
                                                </div>
                                                <div className="mt-1">
                                                    {getProviderBadge(
                                                        user.provider
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    이메일 인증
                                                </div>
                                                <div className="mt-1">
                                                    {user.emailVerifiedAt ? (
                                                        <Badge
                                                            variant="default"
                                                            className="bg-green-600"
                                                        >
                                                            인증완료
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            미인증
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    권한
                                                </div>
                                                <div className="mt-1">
                                                    {user.isAdmin ? (
                                                        <Badge variant="default">
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            관리자
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            일반 회원
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    가입일
                                                </div>
                                                <div className="mt-1 text-sm">
                                                    {new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString(
                                                        "ko-KR",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    최근 주문 내역
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.orders.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        주문 내역이 없습니다.
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>주문번호</TableHead>
                                                <TableHead>상품</TableHead>
                                                <TableHead className="text-center">
                                                    상태
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    금액
                                                </TableHead>
                                                <TableHead>주문일</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {user.orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        <Link
                                                            href={route(
                                                                "admin.orders.show",
                                                                order.id
                                                            )}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {order.orderId}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            order.items[0]
                                                                ?.productName
                                                        }
                                                        {order.items.length >
                                                            1 && (
                                                            <span className="text-gray-500">
                                                                {" "}
                                                                외{" "}
                                                                {order.items
                                                                    .length - 1}
                                                                건
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant={getStatusBadgeVariant(
                                                                order.statusColor
                                                            )}
                                                        >
                                                            {order.statusLabel}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        ₩
                                                        {order.totalAmount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-500">
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString(
                                                            "ko-KR"
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    회원 통계
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            총 주문 수
                                        </span>
                                        <span className="text-2xl font-bold">
                                            {user.ordersCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            총 구매 금액
                                        </span>
                                        <span className="text-2xl font-bold">
                                            ₩
                                            {user.totalSpent?.toLocaleString() ||
                                                0}
                                        </span>
                                    </div>
                                </div>
                                {user.ordersCount > 0 && (
                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                평균 주문 금액
                                            </span>
                                            <span className="text-lg font-medium">
                                                ₩
                                                {Math.round(
                                                    (user.totalSpent || 0) /
                                                        user.ordersCount
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    계정 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        가입일
                                    </span>
                                    <span>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("ko-KR")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        최종 수정
                                    </span>
                                    <span>
                                        {new Date(
                                            user.updatedAt
                                        ).toLocaleDateString("ko-KR")}
                                    </span>
                                </div>
                                {user.emailVerifiedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            이메일 인증일
                                        </span>
                                        <span>
                                            {new Date(
                                                user.emailVerifiedAt
                                            ).toLocaleDateString("ko-KR")}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
