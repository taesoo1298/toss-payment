import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, User, Menu, Smile } from 'lucide-react';
import { User as UserType } from '@/types';

interface HeaderProps {
    user?: UserType;
}

export default function Header({ user }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <p>✨ 치과의사가 직접 개발한 프리미엄 치약 | 3만원 이상 무료배송</p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:underline">치과상담</Link>
                            <Link href="#" className="hover:underline">주문조회</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Smile className="h-8 w-8 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary">Dr.Smile</span>
                            <span className="text-xs text-muted-foreground">치과의사의 치약</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="치약 제품을 검색하세요..."
                                className="pl-10 w-full"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/cart">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span className="sr-only">장바구니</span>
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="/mypage">
                                        <User className="h-5 w-5 mr-2" />
                                        {user.name}
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/login">로그인</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">회원가입</Link>
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="border-t">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-8 py-3 overflow-x-auto">
                        <Link href="/products" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            전체상품
                        </Link>
                        <Link href="/category/whitening" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            미백케어
                        </Link>
                        <Link href="/category/gum" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            잇몸케어
                        </Link>
                        <Link href="/category/sensitive" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            민감치아
                        </Link>
                        <Link href="/category/kids" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            어린이용
                        </Link>
                        <Link href="/category/herbal" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            한방치약
                        </Link>
                        <Link href="/category/total" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            토탈케어
                        </Link>
                        <Link href="/category/gift" className="text-sm font-medium hover:text-primary whitespace-nowrap">
                            선물세트
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
