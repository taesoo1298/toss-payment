import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";

export default function ReturnPolicy({ auth }: PageProps) {
    return (
        <>
            <Head title="반품/교환 정책 - Dr.Smile" />
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
                            <RotateCcw className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">반품/교환 정책</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Dr.Smile 반품 및 교환 안내
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">반품/교환 가능 기간</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>제품 수령 후 7일 이내 신청 가능합니다</li>
                                    <li>단순 변심의 경우, 왕복 배송비가 발생할 수 있습니다</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">반품/교환 불가 사유</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>제품 포장이 훼손된 경우</li>
                                    <li>제품을 개봉하여 사용한 경우 (위생상품)</li>
                                    <li>고객의 부주의로 제품이 손상된 경우</li>
                                    <li>제품 수령 후 7일이 경과한 경우</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">배송비 안내</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>제품 하자/오배송: 회사 부담</li>
                                    <li>단순 변심: 고객 부담 (왕복 배송비 6,000원)</li>
                                    <li>교환 시: 왕복 배송비 발생</li>
                                </ul>
                            </section>

                            <div className="mt-6 pt-6 border-t">
                                <Link href="/mypage/orders">
                                    <Button className="w-full md:w-auto">주문 내역에서 신청하기</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
