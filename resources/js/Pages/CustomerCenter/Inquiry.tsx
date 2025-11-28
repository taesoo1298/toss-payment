import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { MessageCircle, Plus, CheckCircle, Clock, XCircle } from "lucide-react";

interface Inquiry {
    id: number;
    category: string;
    subject: string;
    status: "pending" | "answered" | "closed";
    orderId: string | null;
    createdAt: string;
    answeredAt: string | null;
    hasAnswer: boolean;
}

interface InquiryProps extends PageProps {
    inquiries: Inquiry[];
    selectedStatus: string;
}

export default function Inquiry({
    auth,
    inquiries,
    selectedStatus,
}: InquiryProps) {
    const user = auth.user!;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "pending":
                return {
                    label: "답변 대기",
                    color: "bg-yellow-100 text-yellow-800",
                    icon: Clock,
                };
            case "answered":
                return {
                    label: "답변 완료",
                    color: "bg-green-100 text-green-800",
                    icon: CheckCircle,
                };
            case "closed":
                return {
                    label: "종료",
                    color: "bg-gray-100 text-gray-800",
                    icon: XCircle,
                };
            default:
                return {
                    label: status,
                    color: "bg-gray-100 text-gray-800",
                    icon: MessageCircle,
                };
        }
    };

    return (
        <>
            <Head title="1:1 문의" />

            <MyPageLayout user={user} currentPage="inquiry">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">1:1 문의</h1>
                            <p className="text-muted-foreground mt-1">
                                {inquiries.length}개의 문의
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/customer-center/inquiry/create">
                                <Plus className="h-4 w-4 mr-2" />새 문의 작성
                            </Link>
                        </Button>
                    </div>

                    {/* Status Filters */}
                    <div className="flex gap-2">
                        <Button
                            variant={
                                selectedStatus === "all" ? "default" : "outline"
                            }
                            asChild
                        >
                            <Link href="/customer-center/inquiry">전체</Link>
                        </Button>
                        <Button
                            variant={
                                selectedStatus === "pending"
                                    ? "default"
                                    : "outline"
                            }
                            asChild
                        >
                            <Link href="/customer-center/inquiry?status=pending">
                                답변 대기
                            </Link>
                        </Button>
                        <Button
                            variant={
                                selectedStatus === "answered"
                                    ? "default"
                                    : "outline"
                            }
                            asChild
                        >
                            <Link href="/customer-center/inquiry?status=answered">
                                답변 완료
                            </Link>
                        </Button>
                        <Button
                            variant={
                                selectedStatus === "closed"
                                    ? "default"
                                    : "outline"
                            }
                            asChild
                        >
                            <Link href="/customer-center/inquiry?status=closed">
                                종료
                            </Link>
                        </Button>
                    </div>

                    {/* Inquiry List */}
                    {inquiries.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">
                                    문의 내역이 없습니다
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    궁금한 점이 있으시면 언제든 문의해주세요
                                </p>
                                <Button asChild>
                                    <Link href="/customer-center/inquiry/create">
                                        <Plus className="h-4 w-4 mr-2" />새 문의
                                        작성
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {inquiries.map((inquiry) => {
                                const statusInfo = getStatusInfo(
                                    inquiry.status
                                );
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <Link
                                        key={inquiry.id}
                                        href={`/customer-center/inquiry/${inquiry.id}`}
                                    >
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <Badge variant="outline">
                                                                {
                                                                    inquiry.category
                                                                }
                                                            </Badge>
                                                            <Badge
                                                                className={
                                                                    statusInfo.color
                                                                }
                                                            >
                                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                                {
                                                                    statusInfo.label
                                                                }
                                                            </Badge>
                                                            {inquiry.orderId && (
                                                                <Badge variant="secondary">
                                                                    주문:{" "}
                                                                    {
                                                                        inquiry.orderId
                                                                    }
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <h3 className="font-semibold mb-2 line-clamp-1">
                                                            {inquiry.subject}
                                                        </h3>

                                                        <div className="text-sm text-muted-foreground">
                                                            <div>
                                                                작성일:{" "}
                                                                {
                                                                    inquiry.createdAt
                                                                }
                                                            </div>
                                                            {inquiry.answeredAt && (
                                                                <div>
                                                                    답변일:{" "}
                                                                    {
                                                                        inquiry.answeredAt
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Help */}
                    <Card className="bg-muted/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">
                                FAQ도 확인해보세요
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                자주 묻는 질문에서 빠른 답변을 찾을 수 있습니다
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/customer-center/faq">
                                    FAQ 보기
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </MyPageLayout>
        </>
    );
}
