import { Head, Link, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEventHandler, useState } from "react";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

interface InquiryCreateProps extends PageProps {}

const categories = [
    { value: "주문/배송", label: "주문/배송" },
    { value: "결제", label: "결제" },
    { value: "회원", label: "회원" },
    { value: "상품", label: "상품" },
    { value: "기타", label: "기타" },
];

export default function InquiryCreate({ auth }: InquiryCreateProps) {
    const user = auth.user!;
    const { data, setData, post, processing, errors, reset } = useForm({
        category: "",
        subject: "",
        content: "",
        order_id: "",
    });

    const [success, setSuccess] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("customer-center.inquiry.store"), {
            onSuccess: () => {
                setSuccess(true);
                reset();
                // Redirect to inquiry list after 2 seconds
                setTimeout(() => {
                    window.location.href = route("customer-center.inquiry");
                }, 2000);
            },
        });
    };

    return (
        <MyPageLayout currentPage="inquiry" user={user}>
            <Head title="1:1 문의 작성" />

            <div className="space-y-6">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/customer-center/inquiry">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            문의 목록으로
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">1:1 문의 작성</h1>
                    <p className="text-muted-foreground mt-2">
                        궁금하신 사항을 남겨주세요. 최대한 빠르게
                        답변드리겠습니다.
                    </p>
                </div>

                {success && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            문의가 성공적으로 등록되었습니다. 문의 목록으로
                            이동합니다...
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>문의 정보</CardTitle>
                        <CardDescription>
                            모든 항목은 필수 입력 사항입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    문의 유형{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(value) =>
                                        setData("category", value)
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="문의 유형을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.value}
                                                value={cat.value}
                                            >
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-600">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <Label htmlFor="subject">
                                    제목 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="subject"
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData("subject", e.target.value)
                                    }
                                    placeholder="문의 제목을 입력하세요"
                                    maxLength={200}
                                    className={
                                        errors.subject ? "border-red-500" : ""
                                    }
                                />
                                <div className="flex justify-between items-center">
                                    <div>
                                        {errors.subject && (
                                            <p className="text-sm text-red-600">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {data.subject.length}/200
                                    </p>
                                </div>
                            </div>

                            {/* Order ID (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="order_id">
                                    주문번호{" "}
                                    <span className="text-muted-foreground">
                                        (선택)
                                    </span>
                                </Label>
                                <Input
                                    id="order_id"
                                    type="text"
                                    value={data.order_id}
                                    onChange={(e) =>
                                        setData("order_id", e.target.value)
                                    }
                                    placeholder="주문 관련 문의인 경우 주문번호를 입력하세요"
                                />
                                <p className="text-xs text-muted-foreground">
                                    주문 관련 문의가 아니면 비워두셔도 됩니다.
                                </p>
                                {errors.order_id && (
                                    <p className="text-sm text-red-600">
                                        {errors.order_id}
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <Label htmlFor="content">
                                    문의 내용{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                    placeholder="문의하실 내용을 상세히 작성해주세요."
                                    rows={10}
                                    className={
                                        errors.content ? "border-red-500" : ""
                                    }
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-600">
                                        {errors.content}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    • 문의하실 내용을 구체적으로 작성해주시면 더
                                    정확한 답변을 받으실 수 있습니다.
                                    <br />
                                    • 개인정보(주민등록번호, 계좌번호 등)는
                                    입력하지 말아주세요.
                                    <br />• 답변은 영업일 기준 1-2일 내에
                                    등록하신 이메일로 발송됩니다.
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex space-x-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing || success}
                                    className="flex-1"
                                >
                                    {processing ? "등록 중..." : "문의 등록"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    <Link href="/customer-center/inquiry">
                                        취소
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-base">
                            문의 전 확인해주세요
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                • FAQ에서 자주 묻는 질문에 대한 답변을 먼저
                                확인해보세요.
                            </p>
                            <p>
                                • 주문 관련 문의는 주문번호를 함께 입력해주시면
                                더 빠른 처리가 가능합니다.
                            </p>
                            <p>
                                • 영업시간: 평일 09:00 - 18:00 (주말/공휴일
                                제외)
                            </p>
                            <p>• 답변 소요시간: 영업일 기준 1-2일</p>
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/customer-center/faq">
                                    FAQ 보러가기
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MyPageLayout>
    );
}
