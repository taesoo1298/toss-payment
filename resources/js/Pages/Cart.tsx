import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Product } from '@/types';
import Header from '@/Components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CartItem extends Product {
    quantity: number;
    selected: boolean;
}

export default function Cart({ auth }: PageProps) {
    // Mock cart data
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Dr.Smile 미백 치약 프로',
            description: '치과 미백 성분으로 누런 치아를 하얗게! 민감한 치아도 OK',
            price: 18900,
            originalPrice: 25000,
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&q=80',
            category: '미백케어',
            quantity: 2,
            selected: true,
        },
        {
            id: 2,
            name: 'Dr.Smile 잇몸케어 치약',
            description: '출혈과 염증을 완화하는 프로폴리스 함유 잇몸 전문 치약',
            price: 16900,
            originalPrice: 22000,
            image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&q=80',
            category: '잇몸케어',
            quantity: 1,
            selected: true,
        },
        {
            id: 6,
            name: 'Dr.Smile 올인원 토탈케어',
            description: '미백+잇몸+충치예방을 한번에! 올인원 솔루션',
            price: 19900,
            originalPrice: 26000,
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&q=80',
            category: '토탈케어',
            quantity: 1,
            selected: false,
        },
    ]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(price);
    };

    const handleQuantityChange = (id: number, delta: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleToggleItem = (id: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleToggleAll = () => {
        const allSelected = cartItems.every(item => item.selected);
        setCartItems(items => items.map(item => ({ ...item, selected: !allSelected })));
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const handleRemoveSelected = () => {
        setCartItems(items => items.filter(item => !item.selected));
    };

    const selectedItems = cartItems.filter(item => item.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalOriginalPrice = selectedItems.reduce(
        (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
        0
    );
    const totalDiscount = totalOriginalPrice - totalPrice;
    const shippingFee = totalPrice >= 30000 ? 0 : 3000;
    const finalPrice = totalPrice + shippingFee;

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요.');
            return;
        }
        router.visit('/payments/create');
    };

    return (
        <>
            <Head title="장바구니" />

            <div className="min-h-screen bg-background">
                <Header user={auth.user} />

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-[1200px] mx-auto">
                        <h1 className="text-3xl font-bold mb-8">장바구니</h1>

                        {cartItems.length === 0 ? (
                            // Empty Cart
                            <Card>
                                <CardContent className="py-20">
                                    <div className="text-center">
                                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold mb-2">장바구니가 비어있습니다</h2>
                                        <p className="text-muted-foreground mb-6">
                                            원하는 상품을 장바구니에 담아보세요
                                        </p>
                                        <Button asChild>
                                            <Link href="/">쇼핑 계속하기</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Cart Items */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Select All & Actions */}
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        checked={cartItems.every(item => item.selected)}
                                                        onCheckedChange={handleToggleAll}
                                                    />
                                                    <span className="font-medium">
                                                        전체선택 ({selectedItems.length}/{cartItems.length})
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemoveSelected}
                                                    disabled={selectedItems.length === 0}
                                                >
                                                    선택삭제
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Cart Items List */}
                                    {cartItems.map(item => (
                                        <Card key={item.id}>
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    {/* Checkbox */}
                                                    <div className="flex items-start pt-2">
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onCheckedChange={() => handleToggleItem(item.id)}
                                                        />
                                                    </div>

                                                    {/* Product Image */}
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        className="flex-shrink-0"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-24 h-24 object-cover rounded-lg border"
                                                        />
                                                    </Link>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/products/${item.id}`}>
                                                            <h3 className="font-semibold mb-1 hover:text-primary">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                                                            {item.description}
                                                        </p>

                                                        <div className="flex items-center justify-between">
                                                            {/* Quantity */}
                                                            <div className="flex items-center border rounded-lg">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-10 text-center text-sm font-medium">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            {/* Price */}
                                                            <div className="text-right">
                                                                {item.originalPrice && (
                                                                    <div className="text-xs text-muted-foreground line-through">
                                                                        {formatPrice(item.originalPrice * item.quantity)}
                                                                    </div>
                                                                )}
                                                                <div className="text-lg font-bold text-primary">
                                                                    {formatPrice(item.price * item.quantity)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="flex-shrink-0"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="lg:col-span-1">
                                    <Card className="sticky top-24">
                                        <CardContent className="p-6">
                                            <h2 className="text-lg font-bold mb-4">주문 요약</h2>

                                            <div className="space-y-3 mb-4 pb-4 border-b">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">상품금액</span>
                                                    <span className="font-medium">
                                                        {formatPrice(totalOriginalPrice)}
                                                    </span>
                                                </div>
                                                {totalDiscount > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">상품할인</span>
                                                        <span className="font-medium text-destructive">
                                                            -{formatPrice(totalDiscount)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">배송비</span>
                                                    <span className="font-medium">
                                                        {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                                <span className="text-lg font-semibold">결제예정금액</span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {formatPrice(finalPrice)}
                                                </span>
                                            </div>

                                            {totalPrice < 30000 && totalPrice > 0 && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <div className="text-xs text-blue-900">
                                                            <strong>{formatPrice(30000 - totalPrice)}</strong> 더 담으면
                                                            무료배송!
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Button
                                                    size="lg"
                                                    className="w-full"
                                                    onClick={handleCheckout}
                                                    disabled={selectedItems.length === 0}
                                                >
                                                    {selectedItems.length > 0
                                                        ? `${selectedItems.length}개 상품 주문하기`
                                                        : '상품을 선택해주세요'}
                                                </Button>
                                                <Button variant="outline" size="lg" className="w-full" asChild>
                                                    <Link href="/">쇼핑 계속하기</Link>
                                                </Button>
                                            </div>

                                            {/* Benefits */}
                                            <div className="mt-6 pt-6 border-t space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    <span>3만원 이상 구매 시 무료배송</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    <span>18시 이전 주문 시 오늘 출발</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    <span>30일 이내 환불 보장</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
