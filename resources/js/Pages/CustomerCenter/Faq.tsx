import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    ThumbsUp,
    Search,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Header from "@/Components/Header";

interface FaqItem {
    id: number;
    category: string;
    question: string;
    answer: string;
    viewCount: number;
    helpfulCount: number;
}

interface FaqProps extends PageProps {
    faqs: FaqItem[];
    categories: Record<string, number>;
    selectedCategory: string;
}

export default function Faq({
    auth,
    faqs: initialFaqs,
    categories,
    selectedCategory,
}: FaqProps) {
    const [faqs, setFaqs] = useState(initialFaqs);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const categoryLabels: Record<string, string> = {
        "주문/배송": "주문/배송",
        "결제": "결제",
        "회원": "회원",
        "상품": "상품",
        "기타": "기타",
    };

    const handleToggle = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleMarkHelpful = async (id: number) => {
        try {
            await axios.post(`/customer-center/faq/${id}/helpful`);
            setFaqs(
                faqs.map((faq) =>
                    faq.id === id
                        ? { ...faq, helpfulCount: faq.helpfulCount + 1 }
                        : faq
                )
            );
        } catch (error) {
            console.error("Failed to mark helpful:", error);
        }
    };

    const filteredFaqs = faqs.filter(
        (faq) =>
            searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="자주 묻는 질문 - FAQ" />

            <div className="min-h-screen bg-background">
                <Header user={auth.user} />

                <main className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="text-center mb-12">
                        <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
                        <p className="text-muted-foreground">
                            Dr.Smile에 대해 궁금한 점을 찾아보세요
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="질문을 검색하세요..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Button
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            asChild
                        >
                            <Link href="/customer-center/faq">
                                전체 ({faqs.length})
                            </Link>
                        </Button>
                        {Object.entries(categories).map(([category, count]) => (
                            <Button
                                key={category}
                                variant={
                                    selectedCategory === category ? "default" : "outline"
                                }
                                asChild
                            >
                                <Link href={`/customer-center/faq?category=${category}`}>
                                    {categoryLabels[category] || category} ({count})
                                </Link>
                            </Button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-4">
                        {filteredFaqs.length === 0 ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        검색 결과가 없습니다
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <Card key={faq.id}>
                                    <CardContent className="p-0">
                                        <button
                                            className="w-full text-left p-6 hover:bg-muted/50 transition-colors"
                                            onClick={() => handleToggle(faq.id)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline">
                                                            {faq.category}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-lg">
                                                        Q. {faq.question}
                                                    </h3>
                                                </div>
                                                {expandedId === faq.id ? (
                                                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                )}
                                            </div>
                                        </button>

                                        {expandedId === faq.id && (
                                            <div className="px-6 pb-6 border-t">
                                                <div className="pt-6 space-y-4">
                                                    <div className="prose prose-sm max-w-none">
                                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                                            A. {faq.answer}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t">
                                                        <div className="text-sm text-muted-foreground">
                                                            조회수 {faq.viewCount} · 도움됨{" "}
                                                            {faq.helpfulCount}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkHelpful(faq.id)}
                                                        >
                                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                                            도움이 돼요
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Additional Help */}
                    <Card className="mt-12 bg-muted/50">
                        <CardContent className="p-6 text-center">
                            <h3 className="font-semibold mb-2">답변을 찾지 못하셨나요?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                1:1 문의를 통해 도움을 받으세요
                            </p>
                            <Button asChild>
                                <Link href="/customer-center/inquiry">1:1 문의하기</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    );
}
