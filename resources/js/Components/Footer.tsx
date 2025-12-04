import { Link } from "@inertiajs/react";
import { Smile } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background border-t py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Smile className="h-6 w-6 text-primary" />
                            <h3 className="font-bold text-lg">Dr.Smile</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            치과의사가 만든 프리미엄 치약
                            <br />
                            건강한 미소를 위한 첫걸음
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">고객지원</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/customer-center/notices" className="hover:text-foreground transition-colors">
                                    공지사항
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer-center/faq" className="hover:text-foreground transition-colors">
                                    자주 묻는 질문
                                </Link>
                            </li>
                            <li>
                                <Link href="/support/consultation" className="hover:text-foreground transition-colors">
                                    치과의사 상담
                                </Link>
                            </li>
                            <li>
                                <Link href="/support/delivery" className="hover:text-foreground transition-colors">
                                    배송 조회
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">이용안내</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                                    이용약관
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                                    개인정보처리방침
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/return-policy" className="hover:text-foreground transition-colors">
                                    반품/교환 정책
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/subscription" className="hover:text-foreground transition-colors">
                                    정기배송 안내
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Dr.Smile</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/about/brand" className="hover:text-foreground transition-colors">
                                    브랜드 스토리
                                </Link>
                            </li>
                            <li>
                                <Link href="/about/dentist" className="hover:text-foreground transition-colors">
                                    치과의사 소개
                                </Link>
                            </li>
                            <li>
                                <Link href="/about/clinical" className="hover:text-foreground transition-colors">
                                    임상실험 결과
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/partnership" className="hover:text-foreground transition-colors">
                                    제휴문의
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p className="mb-2">
                        상호명: Dr.Smile | 대표: 김민수 | 사업자등록번호: 123-45-67890
                    </p>
                    <p>&copy; 2025 Dr.Smile. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
