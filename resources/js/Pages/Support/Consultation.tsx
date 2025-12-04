import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { ChevronLeft, MessageCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Consultation({ auth }: PageProps) {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 연동
        setSubmitted(true);
    };

    return (
        <>
            <Head title="치과의사 상담 - Dr.Smile" />
            <Header user={auth.user} />

            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="mb-6">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                홈으로 돌아가기
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <MessageCircle className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">치과의사 상담</h1>
                        </div>
                        <p className="text-muted-foreground">
                            치아 건강 고민, 전문가에게 무료로 상담 받으세요
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">상담 안내</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>Dr.Smile 전속 치과의사가 직접 답변드립니다</li>
                                    <li>평일 오전 9시 ~ 오후 6시 (점심시간 12-1시 제외)</li>
                                    <li>주말 및 공휴일: 다음 영업일에 순차 답변</li>
                                    <li>평균 답변 시간: 24시간 이내</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">상담 신청하기</h2>

                                {submitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">상담이 접수되었습니다</h3>
                                        <p className="text-muted-foreground mb-6">
                                            담당 치과의사가 검토 후 24시간 이내에 답변드리겠습니다.<br />
                                            답변은 등록하신 이메일로 발송됩니다.
                                        </p>
                                        <Link href="/">
                                            <Button>홈으로 돌아가기</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="name">이름 *</Label>
                                                <Input id="name" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="age">연령대</Label>
                                                <select id="age" className="w-full border rounded-md p-2">
                                                    <option value="">선택해주세요</option>
                                                    <option value="10s">10대</option>
                                                    <option value="20s">20대</option>
                                                    <option value="30s">30대</option>
                                                    <option value="40s">40대</option>
                                                    <option value="50s">50대</option>
                                                    <option value="60+">60대 이상</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email">이메일 * (답변 발송용)</Label>
                                                <Input id="email" type="email" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">연락처</Label>
                                                <Input id="phone" type="tel" placeholder="선택사항" />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="category">상담 분야 *</Label>
                                            <select id="category" className="w-full border rounded-md p-2" required>
                                                <option value="">선택해주세요</option>
                                                <option value="whitening">미백 관련</option>
                                                <option value="gum">잇몸 관련</option>
                                                <option value="sensitive">시린이 관련</option>
                                                <option value="cavity">충치 예방</option>
                                                <option value="product">제품 추천</option>
                                                <option value="other">기타</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="title">제목 *</Label>
                                            <Input id="title" placeholder="예: 미백 치약 사용 후 시린 증상" required />
                                        </div>

                                        <div>
                                            <Label htmlFor="content">상담 내용 *</Label>
                                            <Textarea
                                                id="content"
                                                rows={8}
                                                placeholder="증상, 기간, 현재 사용 중인 제품 등을 상세히 작성해주시면 더 정확한 답변을 드릴 수 있습니다."
                                                required
                                            />
                                        </div>

                                        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                                            <p className="font-semibold mb-2">유의사항</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>본 상담은 치과 치료를 대신할 수 없으며, 참고 자료로만 활용하시기 바랍니다</li>
                                                <li>증상이 심한 경우 반드시 치과를 방문하시기 바랍니다</li>
                                                <li>개인정보는 상담 목적으로만 사용되며 안전하게 보관됩니다</li>
                                            </ul>
                                        </div>

                                        <Button type="submit" className="w-full">상담 신청하기</Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-3">자주 묻는 질문</h2>
                                <p className="text-muted-foreground mb-4">
                                    빠른 답변이 필요하신가요? 자주 묻는 질문에서 답을 찾아보세요.
                                </p>
                                <Link href="/customer-center/faq">
                                    <Button variant="outline">FAQ 보러가기</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
