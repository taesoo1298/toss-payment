import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ChevronLeft, FlaskConical, CheckCircle2 } from "lucide-react";

export default function ClinicalTest({ auth }: PageProps) {
    return (
        <>
            <Head title="임상실험 결과 - Dr.Smile" />
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
                            <FlaskConical className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">임상실험 결과</h1>
                        </div>
                        <p className="text-muted-foreground">
                            과학적으로 검증된 Dr.Smile의 효능
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">미백 효과 임상시험</h2>
                                <Badge className="mb-4">2024년 서울대학교 치의학연구원</Badge>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">시험 개요</h3>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            <li>대상: 20-50대 성인 200명</li>
                                            <li>기간: 4주간</li>
                                            <li>방법: 1일 2회 칫솔질</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">결과</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="border rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-primary mb-2">92%</div>
                                                <p className="text-sm text-muted-foreground">미백 효과 체감</p>
                                            </div>
                                            <div className="border rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-primary mb-2">2단계</div>
                                                <p className="text-sm text-muted-foreground">평균 색조 개선</p>
                                            </div>
                                            <div className="border rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                                                <p className="text-sm text-muted-foreground">재구매 의향</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">잇몸 건강 개선 연구</h2>
                                <Badge className="mb-4">2024년 연세대학교 치과병원</Badge>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">시험 개요</h3>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            <li>대상: 잇몸 질환자 150명</li>
                                            <li>기간: 8주간</li>
                                            <li>측정: 치은염지수(GI), 치석지수(PI)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">결과</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                <span className="text-muted-foreground">치은염지수 평균 43% 감소</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                <span className="text-muted-foreground">잇몸 출혈 88% 감소</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                <span className="text-muted-foreground">치주낭 깊이 평균 1.2mm 개선</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">안전성 테스트</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="text-muted-foreground">피부 자극 테스트 통과 (인체적용시험)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="text-muted-foreground">중금속 검사 적합</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="text-muted-foreground">유해물질 無검출</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="text-muted-foreground">식약처 기능성 치약 인증</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Link href="/products">
                                <Button>제품 보러가기</Button>
                            </Link>
                            <Link href="/about/brand">
                                <Button variant="outline">브랜드 스토리</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
