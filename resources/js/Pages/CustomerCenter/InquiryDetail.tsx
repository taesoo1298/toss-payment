import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    XCircle,
    Download,
    Trash2,
    Edit,
} from "lucide-react";
import axios from "axios";
import { router } from "@inertiajs/react";

interface Inquiry {
    id: number;
    category: string;
    subject: string;
    content: string;
    attachments: string[] | null;
    status: "pending" | "answered" | "closed";
    orderId: string | null;
    createdAt: string;
    answer: string | null;
    answeredAt: string | null;
    answeredBy: string | null;
}

interface InquiryDetailProps extends PageProps {
    inquiry: Inquiry;
}

export default function InquiryDetail({ auth, inquiry }: InquiryDetailProps) {
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
                    icon: Clock,
                };
        }
    };

    const handleDelete = async () => {
        if (!confirm("문의를 삭제하시겠습니까?")) {
            return;
        }

        try {
            await axios.delete(`/customer-center/inquiry/${inquiry.id}`);
            alert("문의가 삭제되었습니다.");
            router.visit("/customer-center/inquiry");
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    const handleClose = async () => {
        if (!confirm("문의를 종료하시겠습니까?")) {
            return;
        }

        try {
            await axios.post(`/customer-center/inquiry/${inquiry.id}/close`);
            alert("문의가 종료되었습니다.");
            router.reload();
        } catch (error) {
            alert("종료에 실패했습니다.");
        }
    };

    const statusInfo = getStatusInfo(inquiry.status);
    const StatusIcon = statusInfo.icon;

    return (
        <>
            <Head title={inquiry.subject} />

            <MyPageLayout user={user} currentPage="">
                <div className="space-y-6">
                    <Button variant="ghost" asChild>
                        <Link href="/customer-center/inquiry">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            목록으로
                        </Link>
                    </Button>

                    <Card>
                        <CardContent className="p-8">
                            {/* Question */}
                            <div className="border-b pb-6 mb-6">
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <Badge variant="outline">{inquiry.category}</Badge>
                                    <Badge className={statusInfo.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusInfo.label}
                                    </Badge>
                                    {inquiry.orderId && (
                                        <Badge variant="secondary">
                                            주문: {inquiry.orderId}
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-2xl font-bold mb-4">{inquiry.subject}</h1>

                                <div className="text-sm text-muted-foreground mb-4">
                                    작성일: {inquiry.createdAt}
                                </div>

                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap">{inquiry.content}</div>
                                </div>

                                {inquiry.attachments && inquiry.attachments.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold mb-3 text-sm">첨부파일</h3>
                                        <div className="space-y-2">
                                            {inquiry.attachments.map((attachment, index) => (
                                                <a
                                                    key={index}
                                                    href={attachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-sm"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>{attachment.split("/").pop()}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Answer */}
                            {inquiry.answer ? (
                                <div className="bg-muted/50 rounded-lg p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <h3 className="font-semibold">답변</h3>
                                    </div>

                                    <div className="prose prose-sm max-w-none mb-4">
                                        <div className="whitespace-pre-wrap">{inquiry.answer}</div>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        {inquiry.answeredBy} · {inquiry.answeredAt}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                    <Clock className="h-8 w-8 mx-auto mb-3 text-yellow-600" />
                                    <p className="text-yellow-800 font-medium mb-1">
                                        답변 대기 중
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                        빠른 시일 내에 답변드리겠습니다
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {inquiry.status === "pending" && (
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/customer-center/inquiry/${inquiry.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    수정
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제
                            </Button>
                        </div>
                    )}

                    {inquiry.status === "answered" && (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                문의 종료
                            </Button>
                        </div>
                    )}
                </div>
            </MyPageLayout>
        </>
    );
}
