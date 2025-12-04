import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";

export default function TermsOfService({ auth }: PageProps) {
    return (
        <>
            <Head title="이용약관 - Dr.Smile" />
            <Header user={auth.user} />

            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                홈으로 돌아가기
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">이용약관</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Dr.Smile 서비스 이용약관
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            최종 업데이트: 2025년 11월 1일
                        </p>
                    </div>

                    {/* Content */}
                    <Card>
                        <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    본 약관은 Dr.Smile (이하 "회사")이 운영하는 온라인 쇼핑몰에서 제공하는
                                    인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리,
                                    의무 및 책임사항을 규정함을 목적으로 합니다.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제2조 (정의)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등
                                    정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</li>
                                    <li>"이용자"란 "몰"에 접속하여 본 약관에 따라 "몰"이 제공하는 서비스를 받는
                                    회원 및 비회원을 말합니다.</li>
                                    <li>"회원"이란 "몰"에 개인정보를 제공하여 회원등록을 한 자로서, "몰"의 정보를
                                    지속적으로 제공받으며, "몰"이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                                    <li>"비회원"이란 회원에 가입하지 않고 "몰"이 제공하는 서비스를 이용하는 자를 말합니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제3조 (약관의 명시와 개정)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"은 이 약관의 내용과 상호, 영업소 소재지, 대표자의 성명, 사업자등록번호,
                                    연락처 등을 이용자가 알 수 있도록 초기 서비스화면에 게시합니다.</li>
                                    <li>"몰"은 약관의 규제에 관한 법률, 전자거래기본법, 전자서명법, 정보통신망
                                    이용촉진 및 정보보호 등에 관한 법률, 소비자보호법 등 관련법을 위배하지 않는
                                    범위에서 이 약관을 개정할 수 있습니다.</li>
                                    <li>"몰"이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과
                                    함께 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제4조 (서비스의 제공 및 변경)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"은 다음과 같은 업무를 수행합니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
                                            <li>구매계약이 체결된 재화 또는 용역의 배송</li>
                                            <li>기타 "몰"이 정하는 업무</li>
                                        </ul>
                                    </li>
                                    <li>"몰"은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는
                                    장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제5조 (서비스의 중단)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"은 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의
                                    사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
                                    <li>"몰"은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여
                                    이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, "몰"이 고의 또는
                                    과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제6조 (회원가입)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>이용자는 "몰"이 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에
                                    동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</li>
                                    <li>"몰"은 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에
                                    해당하지 않는 한 회원으로 등록합니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                                            <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                                            <li>기타 회원으로 등록하는 것이 "몰"의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제7조 (회원 탈퇴 및 자격 상실)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회원은 "몰"에 언제든지 탈퇴를 요청할 수 있으며 "몰"은 즉시 회원탈퇴를 처리합니다.</li>
                                    <li>회원이 다음 각호의 사유에 해당하는 경우, "몰"은 회원자격을 제한 및 정지시킬 수 있습니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>가입 신청시에 허위 내용을 등록한 경우</li>
                                            <li>"몰"을 이용하여 구입한 재화 등의 대금, 기타 "몰"이용에 관련하여
                                            회원이 부담하는 채무를 기일에 지급하지 않는 경우</li>
                                            <li>다른 사람의 "몰" 이용을 방해하거나 그 정보를 도용하는 등
                                            전자거래질서를 위협하는 경우</li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제8조 (개인정보 보호)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서
                                    최소한의 개인정보를 수집합니다.</li>
                                    <li>"몰"은 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.
                                    다만, 관련 법령상 의무이행을 위하여 구매계약 이전에 본인확인이 필요한
                                    경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지 아니합니다.</li>
                                    <li>"몰"은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게
                                    그 목적을 고지하고 동의를 받습니다.</li>
                                    <li>상세한 개인정보 처리방침은 별도의 개인정보처리방침 페이지를 참고하시기 바랍니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제9조 (구매신청 및 개인정보 제공 동의)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"이용자는 다음 사항에 관한 정보를 "몰"에 제공하여야 하며,
                                    "몰"은 이용자의 구매신청이 있는 경우 다음 각 호의 사항을 알기 쉽게 제공하여야 합니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>재화 등의 검색 및 선택</li>
                                            <li>성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력</li>
                                            <li>약관내용, 청약철회권이 제한되는 서비스, 배송료·설치비 등의 비용부담과
                                            관련한 내용에 대한 확인</li>
                                            <li>본 약관에 동의하고 위 호의 사항을 확인하거나 거부하는 표시</li>
                                            <li>재화 등의 구매신청 및 이에 관한 확인 또는 "몰"의 확인에 대한 동의</li>
                                            <li>결제방법의 선택</li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">제10조 (계약의 성립)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"몰"은 제9조와 같은 구매신청에 대하여 다음 각호에 해당하면 승낙하지 않을 수 있습니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>신청 내용에 허위, 기재누락, 오기가 있는 경우</li>
                                            <li>미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및
                                            용역을 구매하는 경우</li>
                                            <li>기타 구매신청에 승낙하는 것이 "몰" 기술상 현저히 지장이 있다고
                                            판단하는 경우</li>
                                        </ul>
                                    </li>
                                    <li>"몰"의 승낙이 제12조제1항의 수신확인통지형태로 이용자에게 도달한 시점에
                                    계약이 성립한 것으로 봅니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">부칙</h2>
                                <p className="text-muted-foreground">
                                    본 약관은 2025년 11월 1일부터 시행합니다.
                                </p>
                            </section>

                            <div className="mt-8 pt-6 border-t">
                                <p className="text-sm text-muted-foreground">
                                    문의사항이 있으시면 고객센터로 연락주시기 바랍니다.
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <Link href="/customer-center">
                                        <Button variant="outline">고객센터 바로가기</Button>
                                    </Link>
                                    <Link href="/">
                                        <Button>쇼핑 계속하기</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
