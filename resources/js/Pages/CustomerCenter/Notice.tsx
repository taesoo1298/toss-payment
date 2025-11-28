import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Bell, Pin, AlertCircle, Eye } from "lucide-react";
import Header from "@/Components/Header";

interface Notice {
    id: number;
    category: string;
    title: string;
    isPinned: boolean;
    isImportant: boolean;
    viewCount: number;
    publishedAt: string;
}

interface NoticeProps extends PageProps {
    notices: {
        data: Notice[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Record<string, number>;
    selectedCategory: string;
}

export default function Notice({
    auth,
    notices,
    categories,
    selectedCategory,
}: NoticeProps) {
    const categoryLabels: Record<string, string> = {
        "공지": "공지",
        "이벤트": "이벤트",
        "업데이트": "업데이트",
        "점검": "점검",
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "공지":
                return "bg-blue-100 text-blue-800";
            case "이벤트":
                return "bg-pink-100 text-pink-800";
            case "업데이트":
                return "bg-green-100 text-green-800";
            case "점검":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <Head title="공지사항" />

            <div className="min-h-screen bg-background">
                <Header user={auth.user} />

                <main className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="text-center mb-12">
                        <Bell className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <h1 className="text-3xl font-bold mb-2">공지사항</h1>
                        <p className="text-muted-foreground">
                            Dr.Smile의 새로운 소식을 확인하세요
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Button
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            asChild
                        >
                            <Link href="/customer-center/notices">
                                전체 ({notices.total})
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
                                <Link href={`/customer-center/notices?category=${category}`}>
                                    {categoryLabels[category] || category} ({count})
                                </Link>
                            </Button>
                        ))}
                    </div>

                    {/* Notice List */}
                    <div className="space-y-2">
                        {notices.data.length === 0 ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground">공지사항이 없습니다</p>
                                </CardContent>
                            </Card>
                        ) : (
                            notices.data.map((notice) => (
                                <Link
                                    key={notice.id}
                                    href={`/customer-center/notices/${notice.id}`}
                                >
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                {notice.isPinned && (
                                                    <Pin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <Badge
                                                            className={getCategoryColor(
                                                                notice.category
                                                            )}
                                                        >
                                                            {notice.category}
                                                        </Badge>
                                                        {notice.isImportant && (
                                                            <Badge variant="destructive">
                                                                중요
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                                                        {notice.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>{notice.publishedAt}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-4 w-4" />
                                                            {notice.viewCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {notices.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: notices.last_page }, (_, i) => i + 1).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            page === notices.current_page
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        asChild
                                    >
                                        <Link
                                            href={`/customer-center/notices?page=${page}${
                                                selectedCategory !== "all"
                                                    ? `&category=${selectedCategory}`
                                                    : ""
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    </Button>
                                )
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
