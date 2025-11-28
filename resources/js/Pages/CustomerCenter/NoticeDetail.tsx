import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ArrowLeft, Eye, ChevronUp, ChevronDown, Download } from "lucide-react";
import Header from "@/Components/Header";

interface Notice {
    id: number;
    category: string;
    title: string;
    content: string;
    attachments: string[] | null;
    isPinned: boolean;
    isImportant: boolean;
    viewCount: number;
    publishedAt: string;
    author: string;
}

interface NoticeDetailProps extends PageProps {
    notice: Notice;
    prevNotice: { id: number; title: string } | null;
    nextNotice: { id: number; title: string } | null;
}

export default function NoticeDetail({
    auth,
    notice,
    prevNotice,
    nextNotice,
}: NoticeDetailProps) {
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
            <Head title={notice.title} />

            <div className="min-h-screen bg-background">
                <Header user={auth.user} />

                <main className="container mx-auto px-4 py-12 max-w-4xl">
                    <Button variant="ghost" className="mb-6" asChild>
                        <Link href="/customer-center/notices">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            목록으로
                        </Link>
                    </Button>

                    <Card>
                        <CardContent className="p-8">
                            {/* Header */}
                            <div className="border-b pb-6 mb-6">
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <Badge className={getCategoryColor(notice.category)}>
                                        {notice.category}
                                    </Badge>
                                    {notice.isImportant && (
                                        <Badge variant="destructive">중요</Badge>
                                    )}
                                    {notice.isPinned && (
                                        <Badge variant="outline">고정</Badge>
                                    )}
                                </div>

                                <h1 className="text-3xl font-bold mb-4">{notice.title}</h1>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{notice.author}</span>
                                    <span>·</span>
                                    <span>{notice.publishedAt}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {notice.viewCount}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-sm max-w-none mb-8">
                                <div className="whitespace-pre-wrap">{notice.content}</div>
                            </div>

                            {/* Attachments */}
                            {notice.attachments && notice.attachments.length > 0 && (
                                <div className="border-t pt-6 mb-6">
                                    <h3 className="font-semibold mb-3">첨부파일</h3>
                                    <div className="space-y-2">
                                        {notice.attachments.map((attachment, index) => (
                                            <a
                                                key={index}
                                                href={attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span className="text-sm">
                                                    {attachment.split("/").pop()}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="border-t pt-6 space-y-2">
                                {prevNotice && (
                                    <Link
                                        href={`/customer-center/notices/${prevNotice.id}`}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
                                            <div className="min-w-0">
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    이전 글
                                                </div>
                                                <div className="font-medium truncate">
                                                    {prevNotice.title}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {nextNotice && (
                                    <Link
                                        href={`/customer-center/notices/${nextNotice.id}`}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
                                            <div className="min-w-0">
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    다음 글
                                                </div>
                                                <div className="font-medium truncate">
                                                    {nextNotice.title}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    );
}
