import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    HelpCircle,
    Bell,
    MessageSquare,
    ArrowRight,
    Clock,
    Pin,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import Header from "@/Components/Header";

interface Notice {
    id: number;
    title: string;
    category: string;
    isPinned: boolean;
    isImportant: boolean;
    publishedAt: string;
}

interface Faq {
    id: number;
    category: string;
    question: string;
    viewCount: number;
}

interface Inquiry {
    id: number;
    subject: string;
    category: string;
    status: string;
    createdAt: string;
}

interface FaqCategory {
    name: string;
    slug: string;
    count: number;
}

interface Props {
    recentNotices: Notice[];
    popularFaqs: Faq[];
    recentInquiries: Inquiry[] | null;
    faqCategories: FaqCategory[];
}

const statusLabels: Record<
    string,
    { label: string; variant: "default" | "secondary" | "success" }
> = {
    pending: { label: "답변대기", variant: "default" },
    answered: { label: "답변완료", variant: "success" },
    closed: { label: "종료", variant: "secondary" },
};

export default function CustomerCenterIndex({
    recentNotices,
    popularFaqs,
    recentInquiries,
    faqCategories,
}: Props) {
    return (
        <div>
            <Header title="고객센터" />
            <Head title="고객센터" />

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">고객센터</h1>
                    <p className="text-xl text-muted-foreground">
                        무엇을 도와드릴까요?
                    </p>
                </div>

                {/* Main Service Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* FAQ Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/customer-center/faq">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <HelpCircle className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle>자주 묻는 질문</CardTitle>
                                        <CardDescription>FAQ</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    빠른 답변이 필요하신가요? 자주 묻는 질문을
                                    확인해보세요.
                                </p>
                                <div className="flex items-center text-sm font-medium text-blue-600">
                                    FAQ 보기
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    {/* Notice Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/customer-center/notices">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Bell className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <CardTitle>공지사항</CardTitle>
                                        <CardDescription>
                                            Notices
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Dr.Smile의 새로운 소식과 이벤트를
                                    확인하세요.
                                </p>
                                <div className="flex items-center text-sm font-medium text-green-600">
                                    공지사항 보기
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    {/* Inquiry Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/customer-center/inquiry">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <MessageSquare className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle>1:1 문의</CardTitle>
                                        <CardDescription>
                                            Inquiry
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    궁금한 점이 있으신가요? 1:1 문의를
                                    남겨주세요.
                                </p>
                                <div className="flex items-center text-sm font-medium text-purple-600">
                                    문의하기
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Notices */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Bell className="h-5 w-5" />
                                    <span>최근 공지사항</span>
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/customer-center/notices">
                                        전체보기
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentNotices.map((notice) => (
                                    <Link
                                        key={notice.id}
                                        href={`/customer-center/notices/${notice.id}`}
                                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-start space-x-2">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    {notice.isPinned && (
                                                        <Pin className="h-4 w-4 text-blue-600" />
                                                    )}
                                                    {notice.isImportant && (
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {notice.category}
                                                    </Badge>
                                                </div>
                                                <p className="font-medium line-clamp-1">
                                                    {notice.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {notice.publishedAt}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </Link>
                                ))}
                                {recentNotices.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground py-8">
                                        등록된 공지사항이 없습니다
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular FAQs */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5" />
                                    <span>인기 FAQ</span>
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/customer-center/faq">
                                        전체보기
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularFaqs.map((faq) => (
                                    <Link
                                        key={faq.id}
                                        href={`/customer-center/faq/${faq.id}`}
                                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-start space-x-2">
                                            <div className="flex-1">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs mb-2"
                                                >
                                                    {faq.category}
                                                </Badge>
                                                <p className="font-medium line-clamp-2">
                                                    {faq.question}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    조회수{" "}
                                                    {faq.viewCount.toLocaleString()}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </Link>
                                ))}
                                {popularFaqs.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground py-8">
                                        등록된 FAQ가 없습니다
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Inquiries (only for logged in users) */}
                {recentInquiries && recentInquiries.length > 0 && (
                    <Card className="mt-8">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5" />
                                    <span>내 문의 내역</span>
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/customer-center/inquiry">
                                        전체보기
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentInquiries.map((inquiry) => (
                                    <Link
                                        key={inquiry.id}
                                        href={`/customer-center/inquiry/${inquiry.id}`}
                                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {inquiry.category}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            statusLabels[
                                                                inquiry.status
                                                            ].variant
                                                        }
                                                    >
                                                        {
                                                            statusLabels[
                                                                inquiry.status
                                                            ].label
                                                        }
                                                    </Badge>
                                                </div>
                                                <p className="font-medium line-clamp-1">
                                                    {inquiry.subject}
                                                </p>
                                                <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {inquiry.createdAt}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* FAQ Categories */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>카테고리별 FAQ</CardTitle>
                        <CardDescription>
                            궁금한 주제를 선택하세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                            {faqCategories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/customer-center/faq?category=${category.slug}`}
                                    className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all text-center"
                                >
                                    <p className="font-medium mb-1">
                                        {category.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {category.count}개
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
