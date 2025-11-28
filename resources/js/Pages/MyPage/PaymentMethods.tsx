import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    CreditCard,
    Building2,
    Smartphone,
    Star,
    Trash2,
    Plus,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface PaymentMethod {
    id: number;
    type: "card" | "bank" | "easy_pay";
    displayName: string;
    isDefault: boolean;
    isExpired: boolean;
    cardCompany?: string;
    cardNumber?: string;
    cardNickname?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
    easyPayProvider?: string;
    createdAt: string;
}

interface PaymentMethodsProps extends PageProps {
    paymentMethods: PaymentMethod[];
}

export default function PaymentMethods({
    auth,
    paymentMethods: initialMethods,
}: PaymentMethodsProps) {
    const user = auth.user!;
    const [methods, setMethods] = useState(initialMethods);
    const [loading, setLoading] = useState<number | null>(null);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "card":
                return <CreditCard className="h-5 w-5" />;
            case "bank":
                return <Building2 className="h-5 w-5" />;
            case "easy_pay":
                return <Smartphone className="h-5 w-5" />;
            default:
                return <CreditCard className="h-5 w-5" />;
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case "card":
                return "카드";
            case "bank":
                return "계좌";
            case "easy_pay":
                return "간편결제";
            default:
                return "기타";
        }
    };

    const handleSetDefault = async (methodId: number) => {
        setLoading(methodId);
        try {
            await axios.post(`/api/mypage/payment-methods/${methodId}/set-default`);
            setMethods(
                methods.map((m) => ({
                    ...m,
                    isDefault: m.id === methodId,
                }))
            );
        } catch (error) {
            console.error("Failed to set default:", error);
            alert("기본 결제 수단 설정에 실패했습니다.");
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (methodId: number) => {
        const method = methods.find((m) => m.id === methodId);
        if (method?.isDefault) {
            alert("기본 결제 수단은 삭제할 수 없습니다. 다른 결제 수단을 기본으로 설정한 후 삭제해주세요.");
            return;
        }

        if (!confirm("이 결제 수단을 삭제하시겠습니까?")) {
            return;
        }

        setLoading(methodId);
        try {
            await axios.delete(`/api/mypage/payment-methods/${methodId}`);
            setMethods(methods.filter((m) => m.id !== methodId));
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("삭제에 실패했습니다.");
        } finally {
            setLoading(null);
        }
    };

    const handleAddPaymentMethod = () => {
        // TODO: Implement payment method registration modal
        alert("결제 수단 등록 기능은 개발 중입니다.");
    };

    return (
        <>
            <Head title="결제 수단 관리" />

            <MyPageLayout user={user} currentPage="payments">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">결제 수단 관리</h1>
                            <p className="text-muted-foreground mt-1">
                                등록된 결제 수단 {methods.length}개
                            </p>
                        </div>
                        <Button onClick={handleAddPaymentMethod}>
                            <Plus className="h-4 w-4 mr-2" />
                            결제 수단 추가
                        </Button>
                    </div>

                    {methods.length === 0 ? (
                        <Card>
                            <CardContent className="py-16">
                                <div className="text-center">
                                    <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        등록된 결제 수단이 없습니다
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        결제 수단을 등록하면 빠르게 결제할 수 있습니다
                                    </p>
                                    <Button onClick={handleAddPaymentMethod}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        결제 수단 추가
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {methods.map((method) => (
                                <Card
                                    key={method.id}
                                    className={
                                        method.isDefault
                                            ? "border-primary shadow-sm"
                                            : ""
                                    }
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-3 bg-muted rounded-lg">
                                                    {getTypeIcon(method.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">
                                                            {method.displayName}
                                                        </h3>
                                                        {method.isDefault && (
                                                            <Badge className="gap-1">
                                                                <Star className="h-3 w-3 fill-current" />
                                                                기본
                                                            </Badge>
                                                        )}
                                                        {method.isExpired && (
                                                            <Badge variant="destructive">
                                                                만료됨
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        <div>
                                                            {getTypeName(method.type)}
                                                        </div>
                                                        <div>
                                                            등록일: {method.createdAt}
                                                        </div>
                                                    </div>

                                                    {method.isExpired && (
                                                        <div className="flex items-center gap-2 mt-3 p-3 bg-destructive/10 rounded-md">
                                                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                                                            <p className="text-sm text-destructive">
                                                                이 결제 수단은 만료되었습니다. 재등록이 필요합니다.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {!method.isDefault && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleSetDefault(method.id)}
                                                        disabled={loading === method.id}
                                                    >
                                                        기본으로 설정
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(method.id)}
                                                    disabled={loading === method.id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                안내사항
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• 등록된 결제 수단은 주문 시 빠른 결제에 사용됩니다.</li>
                                <li>• 카드 정보는 안전하게 암호화되어 저장됩니다.</li>
                                <li>• 기본 결제 수단은 결제 시 자동으로 선택됩니다.</li>
                                <li>
                                    • 결제 수단 만료 시 재등록이 필요합니다.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </MyPageLayout>
        </>
    );
}
