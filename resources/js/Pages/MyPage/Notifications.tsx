import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Mail,
    MessageSquare,
    Bell,
    ShoppingBag,
    Tag,
    FileText,
    Package,
    MessageCircle,
    Clock,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface NotificationSettings {
    emailOrderUpdates: boolean;
    emailPromotions: boolean;
    emailNewsletter: boolean;
    emailProductRestock: boolean;
    smsOrderUpdates: boolean;
    smsPromotions: boolean;
    pushOrderUpdates: boolean;
    pushPromotions: boolean;
    pushProductRestock: boolean;
    pushReviewReminders: boolean;
    marketingEmailConsent: boolean;
    marketingSmsConsent: boolean;
    marketingConsentDate: string | null;
    doNotDisturbEnabled: boolean;
    doNotDisturbStart: string;
    doNotDisturbEnd: string;
}

interface NotificationsProps extends PageProps {
    settings: NotificationSettings;
}

export default function Notifications({
    auth,
    settings: initialSettings,
}: NotificationsProps) {
    const user = auth.user!;
    const [settings, setSettings] = useState(initialSettings);
    const [saving, setSaving] = useState(false);

    const handleToggle = async (field: keyof NotificationSettings) => {
        const newValue = !settings[field];
        setSettings({ ...settings, [field]: newValue });

        try {
            await axios.patch("/api/mypage/notification-settings", {
                [field]: newValue,
            });
        } catch (error) {
            console.error("Failed to update settings:", error);
            // Revert on error
            setSettings({ ...settings, [field]: !newValue });
            alert("설정 변경에 실패했습니다.");
        }
    };

    const handleMarketingConsent = async () => {
        const emailConsent = !settings.marketingEmailConsent;
        const smsConsent = !settings.marketingSmsConsent;

        setSettings({
            ...settings,
            marketingEmailConsent: emailConsent,
            marketingSmsConsent: smsConsent,
        });

        try {
            await axios.post(
                "/api/mypage/notification-settings/marketing-consent",
                {
                    email_consent: emailConsent,
                    sms_consent: smsConsent,
                }
            );
        } catch (error) {
            console.error("Failed to update marketing consent:", error);
            setSettings({
                ...settings,
                marketingEmailConsent: !emailConsent,
                marketingSmsConsent: !smsConsent,
            });
            alert("마케팅 수신 동의 변경에 실패했습니다.");
        }
    };

    const handleDndUpdate = async () => {
        setSaving(true);
        try {
            await axios.post(
                "/api/mypage/notification-settings/do-not-disturb",
                {
                    enabled: settings.doNotDisturbEnabled,
                    start_time: settings.doNotDisturbStart,
                    end_time: settings.doNotDisturbEnd,
                }
            );
            alert("방해 금지 모드 설정이 저장되었습니다.");
        } catch (error) {
            console.error("Failed to update DND settings:", error);
            alert("설정 저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Head title="알림 설정" />

            <MyPageLayout user={user} currentPage="notifications">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">알림 설정</h1>
                        <p className="text-muted-foreground mt-1">
                            이메일, SMS, 푸시 알림을 관리할 수 있습니다
                        </p>
                    </div>

                    {/* Email Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                이메일 알림
                            </CardTitle>
                            <CardDescription>
                                이메일로 받을 알림을 선택하세요
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>주문/배송 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        주문 접수, 배송 시작, 배송 완료 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailOrderUpdates}
                                    onCheckedChange={() =>
                                        handleToggle("emailOrderUpdates")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>프로모션/할인 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        특가 상품, 할인 쿠폰 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailPromotions}
                                    onCheckedChange={() =>
                                        handleToggle("emailPromotions")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>뉴스레터</Label>
                                    <p className="text-sm text-muted-foreground">
                                        신제품 소식, 구강 건강 팁 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailNewsletter}
                                    onCheckedChange={() =>
                                        handleToggle("emailNewsletter")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>재입고 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        품절 상품 재입고 시
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailProductRestock}
                                    onCheckedChange={() =>
                                        handleToggle("emailProductRestock")
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SMS Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                SMS 알림
                            </CardTitle>
                            <CardDescription>
                                문자로 받을 알림을 선택하세요
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>주문/배송 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        주문 접수, 배송 시작, 배송 완료 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.smsOrderUpdates}
                                    onCheckedChange={() =>
                                        handleToggle("smsOrderUpdates")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>프로모션/할인 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        특가 상품, 할인 쿠폰 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.smsPromotions}
                                    onCheckedChange={() =>
                                        handleToggle("smsPromotions")
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Push Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                푸시 알림
                            </CardTitle>
                            <CardDescription>
                                앱에서 받을 푸시 알림을 선택하세요
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>주문/배송 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        주문 접수, 배송 시작, 배송 완료 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushOrderUpdates}
                                    onCheckedChange={() =>
                                        handleToggle("pushOrderUpdates")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>프로모션/할인 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        특가 상품, 할인 쿠폰 등
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushPromotions}
                                    onCheckedChange={() =>
                                        handleToggle("pushPromotions")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>재입고 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        찜한 상품 재입고 시
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushProductRestock}
                                    onCheckedChange={() =>
                                        handleToggle("pushProductRestock")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>리뷰 작성 알림</Label>
                                    <p className="text-sm text-muted-foreground">
                                        구매 후 리뷰 작성 안내
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushReviewReminders}
                                    onCheckedChange={() =>
                                        handleToggle("pushReviewReminders")
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marketing Consent */}
                    <Card className="border-amber-200 bg-amber-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                마케팅 수신 동의
                            </CardTitle>
                            <CardDescription>
                                프로모션 및 광고성 정보 수신에 동의합니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>이메일 & SMS 마케팅 수신</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {settings.marketingConsentDate
                                            ? `동의일: ${settings.marketingConsentDate}`
                                            : "미동의"}
                                    </p>
                                </div>
                                <Switch
                                    checked={
                                        settings.marketingEmailConsent &&
                                        settings.marketingSmsConsent
                                    }
                                    onCheckedChange={handleMarketingConsent}
                                />
                            </div>

                            <div className="p-3 bg-amber-100/50 rounded-md text-sm text-amber-900">
                                <AlertCircle className="h-4 w-4 inline mr-2" />
                                언제든지 마케팅 수신 동의를 철회할 수 있습니다.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Do Not Disturb */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                방해 금지 모드
                            </CardTitle>
                            <CardDescription>
                                특정 시간대에 알림을 받지 않습니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>방해 금지 모드 사용</Label>
                                <Switch
                                    checked={settings.doNotDisturbEnabled}
                                    onCheckedChange={() =>
                                        handleToggle("doNotDisturbEnabled")
                                    }
                                />
                            </div>

                            {settings.doNotDisturbEnabled && (
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>시작 시간</Label>
                                            <Input
                                                type="time"
                                                value={
                                                    settings.doNotDisturbStart
                                                }
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        doNotDisturbStart:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>종료 시간</Label>
                                            <Input
                                                type="time"
                                                value={settings.doNotDisturbEnd}
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        doNotDisturbEnd:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleDndUpdate}
                                        disabled={saving}
                                        className="w-full"
                                    >
                                        {saving
                                            ? "저장 중..."
                                            : "시간 설정 저장"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Info */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    • 주문/배송 알림은 정상적인 서비스 이용을
                                    위해 필수입니다.
                                </li>
                                <li>
                                    • 방해 금지 모드는 푸시 알림에만 적용됩니다.
                                </li>
                                <li>
                                    • 중요한 알림(결제 확인 등)은 방해 금지
                                    모드에도 전송됩니다.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </MyPageLayout>
        </>
    );
}
