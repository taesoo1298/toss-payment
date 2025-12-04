import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ChevronLeft, Truck, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function DeliveryTracking({ auth }: PageProps) {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [tracking, setTracking] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 연동
        // Mock data
        setTracking({
            trackingNumber: trackingNumber,
            status: "shipping",
            courier: "CJ대한통운",
            history: [
                { date: "2025-12-04 09:30", status: "배송중", location: "서울 강남구 배송센터" },
                { date: "2025-12-03 14:20", status: "집화완료", location: "서울 용산구 집하센터" },
                { date: "2025-12-03 10:15", status: "상품준비", location: "Dr.Smile 물류센터" },
            ]
        });
    };

    return (
        <>
            <Head title="배송 조회 - Dr.Smile" />
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
                            <Truck className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">배송 조회</h1>
                        </div>
                        <p className="text-muted-foreground">
                            주문하신 상품의 배송 상태를 확인하세요
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div>
                                        <Label htmlFor="tracking">운송장 번호</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="tracking"
                                                placeholder="운송장 번호를 입력하세요"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                required
                                            />
                                            <Button type="submit">조회</Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            주문 완료 후 마이페이지 &gt; 주문내역에서 운송장 번호를 확인할 수 있습니다
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {tracking && (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-3">배송 정보</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">운송장 번호</p>
                                                    <p className="font-semibold">{tracking.trackingNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">택배사</p>
                                                    <p className="font-semibold">{tracking.courier}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-4">배송 단계</h3>
                                            <div className="relative">
                                                {tracking.history.map((item: any, index: number) => (
                                                    <div key={index} className="flex gap-4 pb-6 relative">
                                                        {index !== tracking.history.length - 1 && (
                                                            <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-border" />
                                                        )}
                                                        <div className={`w-4 h-4 rounded-full z-10 ${
                                                            index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                                                        }`} />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className={`font-semibold ${
                                                                    index === 0 ? 'text-primary' : ''
                                                                }`}>
                                                                    {item.status}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.date}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {item.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">배송 안내</h2>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>평일 오후 2시 이전 주문: 당일 발송</li>
                                    <li>평일 오후 2시 이후 주문: 익일 발송</li>
                                    <li>주말/공휴일 주문: 다음 영업일 발송</li>
                                    <li>배송 기간: 발송 후 1-3일 (도서산간 지역 제외)</li>
                                    <li>30,000원 이상 구매 시 무료배송</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {auth.user && (
                            <div className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    마이페이지에서 모든 주문의 배송 상태를 한눈에 확인하세요
                                </p>
                                <Link href="/mypage/orders">
                                    <Button>주문 내역 보기</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
