import { Head } from "@inertiajs/react";
import { PageProps, Product } from "@/types";
import Header from "@/Components/Header";
import HeroBanner from "@/Components/HeroBanner";
import ProductCard from "@/Components/ProductCard";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Truck,
    CreditCard,
    RefreshCcw,
    Headphones,
    ArrowRight,
    Smile,
    Shield,
    Leaf,
    FlaskConical,
    Award,
} from "lucide-react";

interface HomeProps extends PageProps {
    featuredProducts: Product[];
    newProducts: Product[];
}

export default function Home({
    auth,
    featuredProducts,
    newProducts,
}: HomeProps) {
    // Mock data for dental products
    const mockFeaturedProducts: Product[] = featuredProducts || [
        {
            id: 1,
            name: "Dr.Smile 미백 치약 프로",
            description:
                "치과 미백 성분으로 누런 치아를 하얗게! 민감한 치아도 OK",
            price: 18900,
            originalPrice: 25000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "미백케어",
            badge: "BEST",
            rating: 4.8,
            reviewCount: 2345,
        },
        {
            id: 2,
            name: "Dr.Smile 잇몸케어 치약",
            description:
                "출혈과 염증을 완화하는 프로폴리스 함유 잇몸 전문 치약",
            price: 16900,
            originalPrice: 22000,
            image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80",
            category: "잇몸케어",
            badge: "NEW",
            rating: 4.9,
            reviewCount: 1876,
        },
        {
            id: 3,
            name: "Dr.Smile 민감치아 전용",
            description: "시린이 증상 완화, 질산칼륨 함유로 즉각적인 효과",
            price: 17900,
            image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80",
            category: "민감케어",
            badge: "HOT",
            rating: 4.7,
            reviewCount: 1432,
        },
        {
            id: 4,
            name: "Dr.Smile 키즈 치약 (딸기맛)",
            description: "아이들이 좋아하는 자연 딸기향, 불소 함유로 충치 예방",
            price: 12900,
            image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=500&q=80",
            category: "어린이용",
            rating: 4.6,
            reviewCount: 987,
        },
        {
            id: 5,
            name: "Dr.Smile 한방 프리미엄",
            description: "6가지 한방 성분으로 구취 제거와 구강 건강 동시에",
            price: 21900,
            originalPrice: 28000,
            image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500&q=80",
            category: "한방치약",
            rating: 4.8,
            reviewCount: 1543,
        },
        {
            id: 6,
            name: "Dr.Smile 올인원 토탈케어",
            description: "미백+잇몸+충치예방을 한번에! 올인원 솔루션",
            price: 19900,
            originalPrice: 26000,
            image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80",
            category: "토탈케어",
            badge: "HOT",
            rating: 4.9,
            reviewCount: 2134,
        },
        {
            id: 7,
            name: "Dr.Smile 여행용 미니 세트",
            description: "휴대하기 편한 30ml 3종 세트, 여행 필수품",
            price: 13900,
            image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80",
            category: "여행용",
            badge: "NEW",
            rating: 4.5,
            reviewCount: 654,
        },
        {
            id: 8,
            name: "Dr.Smile 선물세트 프리미엄",
            description: "베스트 3종 + 칫솔 세트, 프리미엄 패키지",
            price: 49900,
            originalPrice: 65000,
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
            category: "선물세트",
            rating: 5.0,
            reviewCount: 892,
        },
    ];

    const features = [
        {
            icon: FlaskConical,
            title: "임상실험 검증",
            description: "대학병원 임상시험으로 효과 입증",
        },
        {
            icon: Leaf,
            title: "자연 유래 성분",
            description: "95% 천연 성분, 유해물질 무첨가",
        },
        {
            icon: Shield,
            title: "식약처 인증",
            description: "의약외품 허가, 안전성 보장",
        },
        {
            icon: Award,
            title: "치과의사 추천",
            description: "전국 500여 치과 추천 제품",
        },
    ];

    return (
        <>
            <Head title="홈" />

            <div className="min-h-screen">
                {/* Header */}
                <Header user={auth.user} />

                {/* Hero Banner */}
                <HeroBanner />

                {/* Features Section */}
                <section className="py-12 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="text-center">
                                    <CardContent className="pt-6">
                                        <feature.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                                        <h3 className="font-semibold mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section id="products" className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">
                                    베스트 치약
                                </h2>
                                <p className="text-muted-foreground">
                                    고객님들이 가장 많이 선택한 인기 제품
                                </p>
                            </div>
                            <Button variant="outline">
                                전체보기
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mockFeaturedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotional Banner */}
                <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">
                            신규 회원 특별 혜택
                        </h2>
                        <p className="text-xl mb-8">
                            지금 가입하고 첫 구매 시 15% 할인 쿠폰을 받아보세요
                        </p>
                        <Button size="lg" variant="secondary">
                            회원가입 하기
                        </Button>
                    </div>
                </section>

                {/* Dentist Story Section */}
                <section id="dentist" className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <Card>
                                <CardContent className="p-8 md:p-12">
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Smile className="h-16 w-16 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-4">
                                                치과의사 Dr.김민수
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                서울대학교 치의학과 졸업 · 20년
                                                임상경험
                                            </p>
                                            <p className="leading-relaxed">
                                                "치과의사로 20년간 환자들을
                                                치료하면서 시중 치약의 한계를
                                                느꼈습니다. 진짜 효과가 있는
                                                성분을 적정 농도로 배합하고,
                                                불필요한 화학 성분은 최소화한
                                                치약을 만들고 싶었습니다.
                                                Dr.Smile은 그런 고민 끝에 탄생한
                                                제품입니다. 임상실험으로 검증된
                                                효과를 직접 경험해보시기
                                                바랍니다."
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* New Products */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">
                                    신제품
                                </h2>
                                <p className="text-muted-foreground">
                                    최신 연구 결과를 반영한 신제품 라인업
                                </p>
                            </div>
                            <Button variant="outline">
                                전체보기
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mockFeaturedProducts.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-background border-t py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Smile className="h-6 w-6 text-primary" />
                                    <h3 className="font-bold text-lg">
                                        Dr.Smile
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    치과의사가 만든 프리미엄 치약
                                    <br />
                                    건강한 미소를 위한 첫걸음
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">고객지원</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>공지사항</li>
                                    <li>자주 묻는 질문</li>
                                    <li>치과의사 상담</li>
                                    <li>배송 조회</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">이용안내</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>이용약관</li>
                                    <li>개인정보처리방침</li>
                                    <li>반품/교환 정책</li>
                                    <li>정기배송 안내</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Dr.Smile</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>브랜드 스토리</li>
                                    <li>치과의사 소개</li>
                                    <li>임상실험 결과</li>
                                    <li>제휴문의</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                            <p className="mb-2">
                                상호명: Dr.Smile | 대표: 김민수 |
                                사업자등록번호: 123-45-67890
                            </p>
                            <p>&copy; 2025 Dr.Smile. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
