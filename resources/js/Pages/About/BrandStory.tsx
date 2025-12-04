import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, Heart, Star, Users } from "lucide-react";

export default function BrandStory({ auth }: PageProps) {
    return (
        <>
            <Head title="브랜드 스토리 - Dr.Smile" />
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
                            <Heart className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">브랜드 스토리</h1>
                        </div>
                        <p className="text-muted-foreground">
                            치과의사가 만든, 건강한 미소를 위한 첫걸음
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Dr.Smile의 시작</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    20년간 치과 임상을 해온 치과의사로서, 수많은 환자들의 치아 건강을 돌보며
                                    한 가지 확신이 생겼습니다. 올바른 치약 선택과 꾸준한 관리가 평생 치아 건강을
                                    좌우한다는 것입니다.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    그러나 시중에는 마케팅으로 포장된 제품들이 너무 많았고, 정작 필요한
                                    성분과 효능을 갖춘 제품을 찾기 어려웠습니다. 그래서 직접 만들기로
                                    결심했습니다. 임상 경험을 바탕으로 한, 진짜 효과있는 치약을.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">우리의 약속</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <Star className="h-12 w-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">임상 검증</h3>
                                        <p className="text-sm text-muted-foreground">
                                            모든 제품은 치과 임상실험을 거쳐 효능이 검증되었습니다
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Heart className="h-12 w-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">안전한 성분</h3>
                                        <p className="text-sm text-muted-foreground">
                                            유해 성분 無첨가, 가족 모두 안심하고 사용할 수 있습니다
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Users className="h-12 w-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">치과의사 추천</h3>
                                        <p className="text-sm text-muted-foreground">
                                            전국 치과의사 1,000명 이상이 사용하고 추천합니다
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Dr.Smile과 함께</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    건강한 치아는 건강한 삶의 시작입니다. Dr.Smile은 단순히 치약을 파는 것이 아니라,
                                    고객 여러분의 평생 치아 건강 파트너가 되고자 합니다. 올바른 제품 선택부터
                                    관리 방법까지, 치과의사의 전문성으로 함께하겠습니다.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Link href="/about/dentist">
                                <Button>치과의사 소개</Button>
                            </Link>
                            <Link href="/about/clinical">
                                <Button variant="outline">임상실험 결과</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
