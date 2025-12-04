import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, GraduationCap, Award, Briefcase } from "lucide-react";

export default function Dentist({ auth }: PageProps) {
    return (
        <>
            <Head title="치과의사 소개 - Dr.Smile" />
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
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">치과의사 소개</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Dr.Smile을 만든 치과의사들을 소개합니다
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3">
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                            <GraduationCap className="h-24 w-24 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-2">대표원장 김민수</h2>
                                        <p className="text-muted-foreground mb-4">Dr.Smile 대표이사 / 치의학박사</p>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <GraduationCap className="h-5 w-5 text-primary" />
                                                    <h3 className="font-semibold">학력</h3>
                                                </div>
                                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-7">
                                                    <li>서울대학교 치의학대학원 졸업</li>
                                                    <li>연세대학교 치과대학 학사</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Briefcase className="h-5 w-5 text-primary" />
                                                    <h3 className="font-semibold">경력</h3>
                                                </div>
                                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-7">
                                                    <li>20년간 강남 소재 치과 원장 역임</li>
                                                    <li>대한치과의사협회 정회원</li>
                                                    <li>서울대학교 치의학대학원 겸임교수</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Award className="h-5 w-5 text-primary" />
                                                    <h3 className="font-semibold">수상 및 인증</h3>
                                                </div>
                                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-7">
                                                    <li>대한치과의사협회 우수 의사상 (2020)</li>
                                                    <li>서울시 보건의료 공로상 (2018)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-3">연구개발팀</h2>
                                <p className="text-muted-foreground mb-4">
                                    Dr.Smile 제품은 치과 전문의, 화학자, 품질관리 전문가로 구성된 R&D팀이
                                    3년간의 연구 개발 끝에 탄생했습니다.
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>치과 전문의 5명 (예방치과, 치주과, 보존과)</li>
                                    <li>화학공학 박사 3명</li>
                                    <li>품질관리 전문가 2명</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Link href="/about/clinical">
                                <Button>임상실험 결과 보기</Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="outline">제품 보러가기</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
