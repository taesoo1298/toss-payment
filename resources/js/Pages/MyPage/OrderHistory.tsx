import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    RotateCcw,
    ChevronRight,
    Search,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: string;
    orderId: string;
    orderDate: string;
    status: "pending" | "preparing" | "shipping" | "delivered" | "cancelled" | "refunded";
    items: OrderItem[];
    totalAmount: number;
    shippingFee: number;
    trackingNumber?: string;
}

export default function OrderHistory({ auth }: PageProps) {
    const user = auth.user!;

    // Mock order data
    const mockOrders: Order[] = [
        {
            id: "1",
            orderId: "ORDER-20251029-001234",
            orderDate: "2025-10-29 14:30:25",
            status: "preparing",
            items: [
                {
                    id: 1,
                    name: "Dr.Smile 미백 치약 프로",
                    price: 18900,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80",
                },
                {
                    id: 2,
                    name: "Dr.Smile 잇몸케어 치약",
                    price: 16900,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80",
                },
            ],
            totalAmount: 54700,
            shippingFee: 0,
        },
        {
            id: "2",
            orderId: "ORDER-20251025-005678",
            orderDate: "2025-10-25 10:15:42",
            status: "delivered",
            items: [
                {
                    id: 3,
                    name: "Dr.Smile 어린이 치약",
                    price: 14900,
                    quantity: 3,
                    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&q=80",
                },
            ],
            totalAmount: 44700,
            shippingFee: 0,
            trackingNumber: "123456789012",
        },
        {
            id: "3",
            orderId: "ORDER-20251020-003456",
            orderDate: "2025-10-20 16:45:10",
            status: "shipping",
            items: [
                {
                    id: 6,
                    name: "Dr.Smile 올인원 토탈케어",
                    price: 19900,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&q=80",
                },
                {
                    id: 4,
                    name: "Dr.Smile 한방 치약",
                    price: 17900,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80",
                },
            ],
            totalAmount: 55700,
            shippingFee: 0,
            trackingNumber: "987654321098",
        },
        {
            id: "4",
            orderId: "ORDER-20251015-007890",
            orderDate: "2025-10-15 11:20:33",
            status: "cancelled",
            items: [
                {
                    id: 7,
                    name: "Dr.Smile 프리미엄 선물세트",
                    price: 49900,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&q=80",
                },
            ],
            totalAmount: 49900,
            shippingFee: 0,
        },
    ];

    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);
    const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [exchangeReason, setExchangeReason] = useState("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const getStatusInfo = (status: Order["status"]) => {
        const statusMap = {
            pending: {
                label: "주문완료",
                color: "bg-blue-100 text-blue-800",
                icon: CheckCircle2,
            },
            preparing: {
                label: "상품준비중",
                color: "bg-yellow-100 text-yellow-800",
                icon: Package,
            },
            shipping: {
                label: "배송중",
                color: "bg-cyan-100 text-cyan-800",
                icon: Truck,
            },
            delivered: {
                label: "배송완료",
                color: "bg-green-100 text-green-800",
                icon: CheckCircle2,
            },
            cancelled: {
                label: "주문취소",
                color: "bg-gray-100 text-gray-800",
                icon: XCircle,
            },
            refunded: {
                label: "환불완료",
                color: "bg-purple-100 text-purple-800",
                icon: RotateCcw,
            },
        };
        return statusMap[status];
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const filterOrders = (status?: Order["status"]) => {
        if (!status || status === "all") return mockOrders;
        return mockOrders.filter((order) => order.status === status);
    };

    const getOrderCount = (status?: Order["status"]) => {
        return filterOrders(status as any).length;
    };

    const filteredOrders = filterOrders(selectedTab as any);

    // Order action handlers
    const handleOpenCancelDialog = (order: Order) => {
        setSelectedOrder(order);
        setSelectedItems(order.items.map(item => item.id));
        setCancelDialogOpen(true);
    };

    const handleOpenRefundDialog = (order: Order) => {
        setSelectedOrder(order);
        setSelectedItems([]);
        setRefundDialogOpen(true);
    };

    const handleOpenExchangeDialog = (order: Order) => {
        setSelectedOrder(order);
        setSelectedItems([]);
        setExchangeDialogOpen(true);
    };

    const handleCancelOrder = () => {
        if (!cancelReason.trim()) {
            alert("취소 사유를 입력해주세요.");
            return;
        }

        // Mock cancel logic
        alert(`주문이 취소되었습니다.\n주문번호: ${selectedOrder?.orderId}\n사유: ${cancelReason}`);

        setCancelDialogOpen(false);
        setCancelReason("");
        setSelectedOrder(null);
    };

    const handleRefundOrder = () => {
        if (selectedItems.length === 0) {
            alert("반품할 상품을 선택해주세요.");
            return;
        }
        if (!refundReason.trim()) {
            alert("반품 사유를 입력해주세요.");
            return;
        }

        // Mock refund logic
        const itemNames = selectedOrder?.items
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.name)
            .join(", ");

        alert(`반품 신청이 완료되었습니다.\n상품: ${itemNames}\n사유: ${refundReason}`);

        setRefundDialogOpen(false);
        setRefundReason("");
        setSelectedItems([]);
        setSelectedOrder(null);
    };

    const handleExchangeOrder = () => {
        if (selectedItems.length === 0) {
            alert("교환할 상품을 선택해주세요.");
            return;
        }
        if (!exchangeReason.trim()) {
            alert("교환 사유를 입력해주세요.");
            return;
        }

        // Mock exchange logic
        const itemNames = selectedOrder?.items
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.name)
            .join(", ");

        alert(`교환 신청이 완료되었습니다.\n상품: ${itemNames}\n사유: ${exchangeReason}`);

        setExchangeDialogOpen(false);
        setExchangeReason("");
        setSelectedItems([]);
        setSelectedOrder(null);
    };

    const toggleItemSelection = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    return (
        <>
            <Head title="주문 내역" />

            <MyPageLayout user={user} currentPage="orders">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold mb-1">주문 내역</h2>
                        <p className="text-muted-foreground">총 {mockOrders.length}건의 주문 내역이 있습니다</p>
                    </div>

                    {/* Order Status Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <Package className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                                    <div className="text-2xl font-bold mb-1">
                                        {getOrderCount("preparing")}
                                    </div>
                                    <div className="text-sm text-muted-foreground">상품준비중</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <Truck className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                                    <div className="text-2xl font-bold mb-1">{getOrderCount("shipping")}</div>
                                    <div className="text-sm text-muted-foreground">배송중</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                    <div className="text-2xl font-bold mb-1">{getOrderCount("delivered")}</div>
                                    <div className="text-sm text-muted-foreground">배송완료</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <XCircle className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                                    <div className="text-2xl font-bold mb-1">{getOrderCount("cancelled")}</div>
                                    <div className="text-sm text-muted-foreground">주문취소</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order List with Tabs */}
                    <Card>
                        <CardHeader>
                            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
                                <TabsList className="grid w-full grid-cols-6">
                                    <TabsTrigger value="all">
                                        전체 ({mockOrders.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="preparing">
                                        준비중 ({getOrderCount("preparing")})
                                    </TabsTrigger>
                                    <TabsTrigger value="shipping">
                                        배송중 ({getOrderCount("shipping")})
                                    </TabsTrigger>
                                    <TabsTrigger value="delivered">
                                        완료 ({getOrderCount("delivered")})
                                    </TabsTrigger>
                                    <TabsTrigger value="cancelled">
                                        취소 ({getOrderCount("cancelled")})
                                    </TabsTrigger>
                                    <TabsTrigger value="refunded">
                                        환불 ({getOrderCount("refunded")})
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardHeader>
                        <CardContent>
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground">해당하는 주문 내역이 없습니다</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredOrders.map((order) => {
                                        const statusInfo = getStatusInfo(order.status);
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <Card key={order.id} className="overflow-hidden">
                                                {/* Order Header */}
                                                <div className="bg-muted/50 px-6 py-4 border-b">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div>
                                                                <div className="text-sm text-muted-foreground mb-1">
                                                                    주문일자
                                                                </div>
                                                                <div className="font-semibold">
                                                                    {formatDate(order.orderDate)}
                                                                </div>
                                                            </div>
                                                            <div className="h-8 w-px bg-border"></div>
                                                            <div>
                                                                <div className="text-sm text-muted-foreground mb-1">
                                                                    주문번호
                                                                </div>
                                                                <div className="font-mono text-sm">
                                                                    {order.orderId}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge className={statusInfo.color}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        {order.items.map((item, index) => (
                                                            <div
                                                                key={item.id}
                                                                className={
                                                                    index < order.items.length - 1
                                                                        ? "pb-4 border-b"
                                                                        : ""
                                                                }
                                                            >
                                                                <div className="flex gap-4">
                                                                    <Link href={`/products/${item.id}`}>
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            className="w-20 h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity"
                                                                        />
                                                                    </Link>
                                                                    <div className="flex-1">
                                                                        <Link
                                                                            href={`/products/${item.id}`}
                                                                            className="font-medium hover:text-primary"
                                                                        >
                                                                            {item.name}
                                                                        </Link>
                                                                        <div className="flex items-center justify-between mt-2">
                                                                            <span className="text-sm text-muted-foreground">
                                                                                {formatPrice(item.price)} × {item.quantity}개
                                                                            </span>
                                                                            <span className="font-bold text-primary">
                                                                                {formatPrice(item.price * item.quantity)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Order Summary */}
                                                    <div className="mt-6 pt-6 border-t">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="font-semibold">총 결제금액</span>
                                                            <span className="text-xl font-bold text-primary">
                                                                {formatPrice(order.totalAmount)}
                                                            </span>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/order/complete?orderId=${order.orderId}`}
                                                                >
                                                                    주문 상세
                                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                                </Link>
                                                            </Button>

                                                            {order.status === "shipping" && order.trackingNumber && (
                                                                <Button variant="outline" className="flex-1">
                                                                    <Truck className="h-4 w-4 mr-2" />
                                                                    배송 조회
                                                                </Button>
                                                            )}

                                                            {order.status === "delivered" && (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="flex-1"
                                                                        onClick={() => handleOpenRefundDialog(order)}
                                                                    >
                                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                                        반품
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="flex-1"
                                                                        onClick={() => handleOpenExchangeDialog(order)}
                                                                    >
                                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                                        교환
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {order.status === "preparing" && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1 text-destructive hover:text-destructive"
                                                                    onClick={() => handleOpenCancelDialog(order)}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-2" />
                                                                    주문 취소
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Help Info */}
                    <Card className="bg-muted/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                주문 관련 안내
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>상품준비중 단계에서만 주문 취소가 가능합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>배송 시작 후에는 배송지 변경이 불가능합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>배송완료 후 30일 이내 미개봉 상품에 한해 환불이 가능합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        교환/반품 문의는 고객센터(1588-1234)로 연락 주시기 바랍니다.
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Cancel Order Dialog */}
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>주문 취소</DialogTitle>
                            <DialogDescription>
                                주문을 취소하시겠습니까? 취소 후에는 복구할 수 없습니다.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {selectedOrder && (
                                <div className="bg-muted p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">주문 정보</div>
                                    <div className="text-sm text-muted-foreground">
                                        주문번호: {selectedOrder.orderId}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        금액: {formatPrice(selectedOrder.totalAmount)}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="cancelReason">취소 사유 *</Label>
                                <Input
                                    id="cancelReason"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="취소 사유를 입력해주세요"
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-900">
                                        <div className="font-medium mb-1">취소 안내</div>
                                        <ul className="space-y-1 text-xs">
                                            <li>• 취소 신청 후 1-3일 이내 환불이 진행됩니다</li>
                                            <li>• 카드 결제의 경우 카드사에 따라 환불이 지연될 수 있습니다</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setCancelDialogOpen(false)}
                            >
                                닫기
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleCancelOrder}
                            >
                                주문 취소
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Refund Dialog */}
                <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>반품 신청</DialogTitle>
                            <DialogDescription>
                                반품할 상품을 선택하고 사유를 입력해주세요.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {selectedOrder && (
                                <>
                                    <div>
                                        <Label className="mb-3 block">반품 상품 선택 *</Label>
                                        <div className="space-y-2">
                                            {selectedOrder.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 p-3 border rounded-lg"
                                                >
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleItemSelection(item.id)}
                                                    />
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatPrice(item.price)} × {item.quantity}개
                                                        </div>
                                                    </div>
                                                    <div className="font-bold">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="refundReason">반품 사유 *</Label>
                                        <Input
                                            id="refundReason"
                                            value={refundReason}
                                            onChange={(e) => setRefundReason(e.target.value)}
                                            placeholder="반품 사유를 입력해주세요"
                                        />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-blue-900">
                                                <div className="font-medium mb-1">반품 안내</div>
                                                <ul className="space-y-1 text-xs">
                                                    <li>• 배송완료 후 30일 이내 미개봉 상품에 한해 반품 가능합니다</li>
                                                    <li>• 반품 신청 후 상품 수거까지 2-3일 소요됩니다</li>
                                                    <li>• 상품 확인 후 환불이 진행됩니다 (3-5일 소요)</li>
                                                    <li>• 단순 변심의 경우 반품 배송비가 발생할 수 있습니다</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setRefundDialogOpen(false)}
                            >
                                닫기
                            </Button>
                            <Button onClick={handleRefundOrder}>
                                반품 신청
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Exchange Dialog */}
                <Dialog open={exchangeDialogOpen} onOpenChange={setExchangeDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>교환 신청</DialogTitle>
                            <DialogDescription>
                                교환할 상품을 선택하고 사유를 입력해주세요.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {selectedOrder && (
                                <>
                                    <div>
                                        <Label className="mb-3 block">교환 상품 선택 *</Label>
                                        <div className="space-y-2">
                                            {selectedOrder.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 p-3 border rounded-lg"
                                                >
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleItemSelection(item.id)}
                                                    />
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatPrice(item.price)} × {item.quantity}개
                                                        </div>
                                                    </div>
                                                    <div className="font-bold">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="exchangeReason">교환 사유 *</Label>
                                        <Input
                                            id="exchangeReason"
                                            value={exchangeReason}
                                            onChange={(e) => setExchangeReason(e.target.value)}
                                            placeholder="교환 사유를 입력해주세요 (예: 사이즈 변경, 색상 변경)"
                                        />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-blue-900">
                                                <div className="font-medium mb-1">교환 안내</div>
                                                <ul className="space-y-1 text-xs">
                                                    <li>• 배송완료 후 30일 이내 미개봉 상품에 한해 교환 가능합니다</li>
                                                    <li>• 교환 신청 후 상품 수거까지 2-3일 소요됩니다</li>
                                                    <li>• 상품 확인 후 교환 상품이 발송됩니다 (3-5일 소요)</li>
                                                    <li>• 단순 변심의 경우 교환 배송비가 발생할 수 있습니다</li>
                                                    <li>• 재고가 없는 경우 환불로 처리될 수 있습니다</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setExchangeDialogOpen(false)}
                            >
                                닫기
                            </Button>
                            <Button onClick={handleExchangeOrder}>
                                교환 신청
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </MyPageLayout>
        </>
    );
}
