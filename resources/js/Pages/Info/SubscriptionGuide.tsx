import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, Calendar, Package } from "lucide-react";

export default function SubscriptionGuide({ auth }: PageProps) {
    return (
        <>
            <Head title="정기배송 안내 - Dr.Smile" />
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
                            <Calendar className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">정기배송 안내</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Dr.Smile 정기배송 서비스
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">정기배송 혜택</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>최대 15% 할인 혜택</li>
                                    <li>무료 배송 (배송비 무료)</li>
                                    <li>배송 주기 자유 설정 (1개월 ~ 3개월)</li>
                                    <li>언제든지 해지 가능</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">배송 주기 선택</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">1개월 주기</h3>
                                        <p className="text-sm text-muted-foreground">10% 할인</p>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">2개월 주기</h3>
                                        <p className="text-sm text-muted-foreground">12% 할인</p>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">3개월 주기</h3>
                                        <p className="text-sm text-muted-foreground">15% 할인</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">이용 안내</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>첫 결제일로부터 선택하신 주기마다 자동 결제됩니다</li>
                                    <li>배송 3일 전 알림톡으로 안내드립니다</li>
                                    <li>배송 주기 변경은 다음 배송 예정일 3일 전까지 가능합니다</li>
                                    <li>해지는 마이페이지에서 언제든지 가능합니다</li>
                                </ul>
                            </section>

                            <div className="mt-6 pt-6 border-t flex gap-4">
                                <Link href="/products">
                                    <Button>정기배송 상품 보기</Button>
                                </Link>
                                <Link href="/mypage">
                                    <Button variant="outline">마이페이지</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
