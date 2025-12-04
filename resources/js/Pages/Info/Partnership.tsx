import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { ChevronLeft, Handshake, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Partnership({ auth }: PageProps) {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 연동
        setSubmitted(true);
    };

    return (
        <>
            <Head title="제휴문의 - Dr.Smile" />
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
                            <Handshake className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">제휴문의</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Dr.Smile과 함께 성장할 파트너를 찾습니다
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">제휴 분야</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">병원 제휴</h3>
                                        <p className="text-sm text-muted-foreground">
                                            치과/병원 내 판매 및 환자 추천 프로그램
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">유통 제휴</h3>
                                        <p className="text-sm text-muted-foreground">
                                            오프라인 매장 입점 및 온라인 플랫폼 제휴
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">마케팅 제휴</h3>
                                        <p className="text-sm text-muted-foreground">
                                            인플루언서, 블로거 협업 프로그램
                                        </p>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">기업 제휴</h3>
                                        <p className="text-sm text-muted-foreground">
                                            단체 구매, 복리후생 프로그램
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">제휴 문의하기</h2>

                                {submitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">문의가 접수되었습니다</h3>
                                        <p className="text-muted-foreground mb-6">
                                            담당자 검토 후 2-3 영업일 내에 연락드리겠습니다.
                                        </p>
                                        <Link href="/">
                                            <Button>홈으로 돌아가기</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="company">회사명/기관명 *</Label>
                                                <Input id="company" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="name">담당자명 *</Label>
                                                <Input id="name" required />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email">이메일 *</Label>
                                                <Input id="email" type="email" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">연락처 *</Label>
                                                <Input id="phone" type="tel" required />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="type">제휴 분야 *</Label>
                                            <select id="type" className="w-full border rounded-md p-2" required>
                                                <option value="">선택해주세요</option>
                                                <option value="hospital">병원 제휴</option>
                                                <option value="distribution">유통 제휴</option>
                                                <option value="marketing">마케팅 제휴</option>
                                                <option value="corporate">기업 제휴</option>
                                                <option value="other">기타</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="content">문의 내용 *</Label>
                                            <Textarea
                                                id="content"
                                                rows={6}
                                                placeholder="제휴 희망 내용을 상세히 기재해주세요"
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full">문의하기</Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
