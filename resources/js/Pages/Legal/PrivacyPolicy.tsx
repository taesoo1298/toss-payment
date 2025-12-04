import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from "@/Components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, Shield } from "lucide-react";

export default function PrivacyPolicy({ auth }: PageProps) {
    return (
        <>
            <Head title="개인정보처리방침 - Dr.Smile" />
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
                            <Shield className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">개인정보처리방침</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Dr.Smile 개인정보 보호 정책
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            최종 업데이트: 2025년 11월 1일
                        </p>
                    </div>

                    {/* Content */}
                    <Card>
                        <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. 개인정보의 처리 목적</h2>
                                <p className="text-muted-foreground leading-relaxed mb-3">
                                    Dr.Smile(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다.
                                    처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며
                                    이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등
                                    필요한 조치를 이행할 예정입니다.
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li><strong>회원 가입 및 관리</strong>
                                        <p className="ml-6 mt-1">회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
                                        회원자격 유지·관리, 서비스 부정이용 방지, 만14세 미만 아동의 개인정보 처리 시
                                        법정대리인의 동의여부 확인, 각종 고지·통지 목적으로 개인정보를 처리합니다.</p>
                                    </li>
                                    <li><strong>재화 또는 서비스 제공</strong>
                                        <p className="ml-6 mt-1">물품배송, 서비스 제공, 청구서 발송, 콘텐츠 제공,
                                        맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산을 목적으로 개인정보를 처리합니다.</p>
                                    </li>
                                    <li><strong>고충처리</strong>
                                        <p className="ml-6 mt-1">민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지,
                                        처리결과 통보 목적으로 개인정보를 처리합니다.</p>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. 개인정보의 처리 및 보유 기간</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를
                                    수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
                                    <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                            <li><strong>회원 가입 및 관리</strong>: 회원 탈퇴 시까지
                                                <p className="ml-6 mt-1 text-sm">다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지</p>
                                                <ul className="list-circle list-inside ml-6 text-sm space-y-1">
                                                    <li>관계 법령 위반에 따른 수사·조사 등이 진행중인 경우: 해당 수사·조사 종료 시까지</li>
                                                    <li>홈페이지 이용에 따른 채권·채무관계 잔존시: 해당 채권·채무관계 정산 시까지</li>
                                                </ul>
                                            </li>
                                            <li><strong>재화 또는 서비스 제공</strong>: 재화·서비스 공급완료 및 요금결제·정산 완료시까지
                                                <p className="ml-6 mt-1 text-sm">다만, 관계법령에 따라 다음과 같이 보유</p>
                                                <ul className="list-circle list-inside ml-6 text-sm space-y-1">
                                                    <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                                                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                                                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                                                    <li>표시·광고에 관한 기록: 6개월 (전자상거래법)</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. 처리하는 개인정보의 항목</h2>
                                <p className="text-muted-foreground mb-3">
                                    회사는 다음의 개인정보 항목을 처리하고 있습니다:
                                </p>
                                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                                    <li><strong>회원 가입 및 관리</strong>
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>필수항목: 성명, 이메일, 비밀번호, 휴대전화번호</li>
                                            <li>선택항목: 생년월일, 성별</li>
                                        </ul>
                                    </li>
                                    <li><strong>재화 또는 서비스 제공</strong>
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>필수항목: 성명, 휴대전화번호, 배송지 주소, 결제정보</li>
                                        </ul>
                                    </li>
                                    <li><strong>인터넷 서비스 이용과정에서 자동 생성·수집되는 정보</strong>
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>IP주소, 쿠키, MAC주소, 서비스 이용 기록, 방문 기록, 불량 이용 기록 등</li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. 개인정보의 제3자 제공</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만
                                    처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및
                                    제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</li>
                                    <li>회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                            <li><strong>배송 대행 업체</strong>
                                                <p className="ml-6 mt-1 text-sm">
                                                    - 제공받는 자: (배송업체명)<br />
                                                    - 제공 목적: 재화의 배송<br />
                                                    - 제공 항목: 성명, 휴대전화번호, 배송지 주소<br />
                                                    - 보유 및 이용기간: 배송 완료 후 3개월
                                                </p>
                                            </li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. 개인정보처리의 위탁</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                            <li><strong>결제 처리</strong>
                                                <p className="ml-6 mt-1 text-sm">
                                                    - 수탁업체: Toss Payments<br />
                                                    - 위탁업무 내용: 결제 처리 및 결제 정보 관리
                                                </p>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외
                                    개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독,
                                    손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를
                                    안전하게 처리하는지를 감독하고 있습니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. 정보주체의 권리·의무 및 행사방법</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
                                    <li>권리 행사는 회사에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편,
                                    모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</li>
                                    <li>권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.</li>
                                    <li>개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제4항, 제37조 제2항에 의하여
                                    정보주체의 권리가 제한될 수 있습니다.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">7. 개인정보의 파기</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                                    지체없이 해당 개인정보를 파기합니다.</li>
                                    <li>파기의 절차 및 방법은 다음과 같습니다:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                            <li><strong>파기절차</strong>
                                                <p className="ml-6 mt-1">불필요한 개인정보 및 개인정보파일은 개인정보책임자의
                                                책임 하에 내부방침 절차에 따라 다음과 같이 처리하고 있습니다.</p>
                                            </li>
                                            <li><strong>파기방법</strong>
                                                <p className="ml-6 mt-1">전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록
                                                파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</p>
                                            </li>
                                        </ul>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">8. 개인정보 보호책임자</h2>
                                <p className="text-muted-foreground mb-3">
                                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                                    정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="font-semibold mb-2">개인정보 보호책임자</p>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>성명: 김민수</li>
                                        <li>직책: 대표이사</li>
                                        <li>연락처: 02-1234-5678</li>
                                        <li>이메일: privacy@drsmile.com</li>
                                    </ul>
                                </div>
                                <p className="text-muted-foreground mt-3">
                                    정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
                                    불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">9. 개인정보 처리방침 변경</h2>
                                <p className="text-muted-foreground">
                                    이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
                                    삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">부칙</h2>
                                <p className="text-muted-foreground">
                                    본 방침은 2025년 11월 1일부터 시행됩니다.
                                </p>
                            </section>

                            <div className="mt-8 pt-6 border-t">
                                <p className="text-sm text-muted-foreground">
                                    개인정보 처리와 관련하여 문의사항이 있으시면 고객센터로 연락주시기 바랍니다.
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
