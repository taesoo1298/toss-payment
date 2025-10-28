import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    Sparkles,
    Shield,
    Award,
    Heart,
    Star,
    ChevronLeft,
    ChevronRight,
    Play,
    Users,
    TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "프리미엄 치약",
            subtitle: "자연 유래 성분 100%",
            description:
                "20년 임상경험을 가진 치과의사가 직접 개발한 전문 구강케어 제품으로, 천연 성분만을 사용하여 안전하고 효과적인 구강 관리를 제공합니다.",
            image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&h=1080&fit=crop&crop=center",
            bgColor: "from-blue-900/90 to-cyan-800/90",
            accentColor: "from-blue-400 to-cyan-300",
            stats: [
                { icon: Shield, label: "식약처 인증", value: "100%" },
                { icon: Users, label: "만족도", value: "99.9%" },
                { icon: TrendingUp, label: "재구매율", value: "98%" },
            ],
        },
        {
            id: 2,
            title: "임상실험 검증",
            subtitle: "99.9% 세균 제거 효과",
            description:
                "국내 유명 대학병원과 협력하여 진행한 엄격한 임상실험을 통해 뛰어난 항균 효과와 구강 건강 개선 효과가 과학적으로 입증되었습니다.",
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1920&h=1080&fit=crop&crop=center",
            bgColor: "from-green-900/90 to-emerald-800/90",
            accentColor: "from-green-400 to-emerald-300",
            stats: [
                { icon: Award, label: "임상실험", value: "완료" },
                { icon: Shield, label: "세균 제거", value: "99.9%" },
                { icon: Heart, label: "건강 개선", value: "95%" },
            ],
        },
        {
            id: 3,
            title: "프리미엄 케어",
            subtitle: "전문가 추천 1위",
            description:
                "전국 치과의사들이 가장 많이 추천하는 구강케어 제품으로, 민감한 잇몸과 치아를 위한 특별한 처방으로 매일 사용해도 안전합니다.",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop&crop=center",
            bgColor: "from-purple-900/90 to-pink-800/90",
            accentColor: "from-purple-400 to-pink-300",
            stats: [
                { icon: Award, label: "전문가 추천", value: "#1" },
                { icon: Heart, label: "순한 처방", value: "100%" },
                { icon: Sparkles, label: "프리미엄", value: "등급" },
            ],
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="relative h-[50vh] md:h-[50vh] overflow-hidden">
            {/* Full-screen slides */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            index === currentSlide
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-105"
                        }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor}`}
                            ></div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-4xl">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 mb-8">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-8 h-8 bg-gradient-to-r ${slide.accentColor} rounded-full flex items-center justify-center`}
                                            >
                                                <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-white">
                                                치과의사 Dr.김민수 개발
                                            </span>
                                        </div>
                                        <div className="flex text-yellow-300">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-3 w-3 fill-current"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                                        <span className="text-white drop-shadow-2xl">
                                            건강한 미소를 위한
                                        </span>
                                        <br />
                                        <span
                                            className={`bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent drop-shadow-2xl`}
                                        >
                                            {slide.title}
                                        </span>
                                    </h1>

                                    <p
                                        className={`text-xl md:text-2xl mb-3 font-bold bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}
                                    >
                                        {slide.subtitle}
                                    </p>

                                    <p className="text-lg mb-8 text-white/90 leading-relaxed max-w-2xl">
                                        {slide.description}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                        <Button
                                            size="lg"
                                            className={`bg-gradient-to-r ${slide.accentColor} hover:scale-105 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform px-6 py-3 font-bold`}
                                            asChild
                                        >
                                            <Link href="#products">
                                                제품 둘러보기
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="lg"
                                            className="bg-white/20 backdrop-blur-lg border-2 border-white/30 hover:bg-white/30 text-white hover:scale-105 transition-all duration-300 px-6 py-3 font-bold"
                                            asChild
                                        >
                                            <Link href="#video">
                                                <Play className="mr-2 h-5 w-5" />
                                                영상 보기
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {slide.stats.map((stat, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                                            >
                                                <div
                                                    className={`w-10 h-10 bg-gradient-to-r ${slide.accentColor} rounded-full flex items-center justify-center shadow-lg`}
                                                >
                                                    <stat.icon className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black text-white">
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-white/80 text-sm font-medium">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-0 z-20 flex items-center justify-between px-8">
                <button
                    onClick={prevSlide}
                    className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                >
                    <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                    onClick={nextSlide}
                    className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                >
                    <ChevronRight className="h-8 w-8" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 ${
                            index === currentSlide
                                ? "w-12 h-4 bg-white rounded-full"
                                : "w-4 h-4 bg-white/50 hover:bg-white/75 rounded-full"
                        }`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
                <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{
                        width: `${((currentSlide + 1) / slides.length) * 100}%`,
                    }}
                />
            </div>
        </section>
    );
}
