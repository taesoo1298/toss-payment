import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import {
    User,
    Lock,
    Eye,
    Shield,
    Trash2,
    Download,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { useState, FormEvent } from "react";
import axios from "axios";

interface UserSettings {
    name: string;
    email: string;
    phone: string | null;
    profilePublic: boolean;
    showEmailPublic: boolean;
    showPhonePublic: boolean;
    allowPersonalizedAds: boolean;
    allowThirdPartySharing: boolean;
    twoFactorEnabled: boolean;
    twoFactorMethod: string | null;
    lastLoginAt: string | null;
    createdAt: string;
}

interface AccountSettingsProps extends PageProps {
    user: UserSettings;
}

export default function AccountSettings({ auth, user: userSettings }: AccountSettingsProps) {
    const user = auth.user!;
    const [profileData, setProfileData] = useState({
        name: userSettings.name,
        email: userSettings.email,
        phone: userSettings.phone || "",
    });
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [privacySettings, setPrivacySettings] = useState({
        profilePublic: userSettings.profilePublic,
        showEmailPublic: userSettings.showEmailPublic,
        showPhonePublic: userSettings.showPhonePublic,
        allowPersonalizedAds: userSettings.allowPersonalizedAds,
        allowThirdPartySharing: userSettings.allowThirdPartySharing,
    });
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.patch("/api/mypage/account/profile", profileData);
            alert("프로필이 업데이트되었습니다.");
        } catch (error: any) {
            alert(error.response?.data?.message || "프로필 업데이트에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.password_confirmation) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("/api/mypage/account/password", passwordData);
            alert("비밀번호가 변경되었습니다.");
            setPasswordData({
                current_password: "",
                password: "",
                password_confirmation: "",
            });
        } catch (error: any) {
            alert(error.response?.data?.message || "비밀번호 변경에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrivacyUpdate = async (field: keyof typeof privacySettings) => {
        const newSettings = {
            ...privacySettings,
            [field]: !privacySettings[field],
        };
        setPrivacySettings(newSettings);

        try {
            await axios.patch("/api/mypage/account/privacy", {
                [field]: newSettings[field],
            });
        } catch (error) {
            // Revert on error
            setPrivacySettings(privacySettings);
            alert("설정 변경에 실패했습니다.");
        }
    };

    const handleEnable2FA = async () => {
        const method = prompt("2단계 인증 방법을 선택하세요 (sms, email, app):");
        if (!method || !["sms", "email", "app"].includes(method)) {
            alert("올바른 인증 방법을 선택해주세요.");
            return;
        }

        try {
            await axios.post("/api/mypage/account/two-factor/enable", { method });
            alert("2단계 인증이 활성화되었습니다.");
            window.location.reload();
        } catch (error) {
            alert("2단계 인증 활성화에 실패했습니다.");
        }
    };

    const handleDisable2FA = async () => {
        const password = prompt("비밀번호를 입력하세요:");
        if (!password) return;

        try {
            await axios.post("/api/mypage/account/two-factor/disable", { password });
            alert("2단계 인증이 비활성화되었습니다.");
            window.location.reload();
        } catch (error) {
            alert("2단계 인증 비활성화에 실패했습니다.");
        }
    };

    const handleDownloadData = async () => {
        try {
            await axios.get("/api/mypage/account/download-data");
            alert("데이터 다운로드 요청이 접수되었습니다. 이메일로 발송됩니다.");
        } catch (error) {
            alert("데이터 다운로드 요청에 실패했습니다.");
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = confirm(
            "정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        );
        if (!confirmed) return;

        const password = prompt("비밀번호를 입력하세요:");
        if (!password) return;

        const reason = prompt("계정 삭제 사유를 입력해주세요 (선택사항):");

        try {
            await axios.delete("/api/mypage/account", {
                data: { password, reason },
            });
            alert("계정 삭제가 요청되었습니다. 30일 후 영구 삭제됩니다.");
            window.location.href = "/";
        } catch (error: any) {
            alert(error.response?.data?.message || "계정 삭제 요청에 실패했습니다.");
        }
    };

    return (
        <>
            <Head title="계정 설정" />

            <MyPageLayout user={user} currentPage="settings">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">계정 설정</h1>
                        <p className="text-muted-foreground mt-1">
                            프로필, 보안, 개인정보 보호 설정을 관리합니다
                        </p>
                    </div>

                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                프로필 정보
                            </CardTitle>
                            <CardDescription>기본 프로필 정보를 수정합니다</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">이름</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">이메일</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                email: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">전화번호</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="010-0000-0000"
                                    />
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "저장 중..." : "프로필 저장"}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t text-sm text-muted-foreground space-y-1">
                                <p>가입일: {userSettings.createdAt}</p>
                                {userSettings.lastLoginAt && (
                                    <p>마지막 로그인: {userSettings.lastLoginAt}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Password Change */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                비밀번호 변경
                            </CardTitle>
                            <CardDescription>
                                비밀번호를 주기적으로 변경하여 보안을 강화하세요
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">현재 비밀번호</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                current_password: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">새 비밀번호</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                password: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        새 비밀번호 확인
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                password_confirmation: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "변경 중..." : "비밀번호 변경"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                개인정보 보호
                            </CardTitle>
                            <CardDescription>
                                개인정보 공개 범위 및 데이터 사용을 설정합니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>프로필 공개</Label>
                                    <p className="text-sm text-muted-foreground">
                                        다른 사용자에게 프로필 공개
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.profilePublic}
                                    onCheckedChange={() => handlePrivacyUpdate("profilePublic")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>이메일 공개</Label>
                                    <p className="text-sm text-muted-foreground">
                                        프로필에서 이메일 주소 공개
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.showEmailPublic}
                                    onCheckedChange={() => handlePrivacyUpdate("showEmailPublic")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>전화번호 공개</Label>
                                    <p className="text-sm text-muted-foreground">
                                        프로필에서 전화번호 공개
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.showPhonePublic}
                                    onCheckedChange={() => handlePrivacyUpdate("showPhonePublic")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>맞춤형 광고 허용</Label>
                                    <p className="text-sm text-muted-foreground">
                                        개인화된 광고 표시 허용
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.allowPersonalizedAds}
                                    onCheckedChange={() =>
                                        handlePrivacyUpdate("allowPersonalizedAds")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>제3자 정보 공유</Label>
                                    <p className="text-sm text-muted-foreground">
                                        파트너사와 정보 공유 허용
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.allowThirdPartySharing}
                                    onCheckedChange={() =>
                                        handlePrivacyUpdate("allowThirdPartySharing")
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                보안 설정
                            </CardTitle>
                            <CardDescription>
                                계정 보안을 강화하는 추가 옵션입니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="font-medium mb-1">2단계 인증</div>
                                    <p className="text-sm text-muted-foreground">
                                        {userSettings.twoFactorEnabled
                                            ? `활성화됨 (${userSettings.twoFactorMethod})`
                                            : "추가 보안 레이어로 계정을 보호하세요"}
                                    </p>
                                </div>
                                {userSettings.twoFactorEnabled ? (
                                    <Button
                                        variant="outline"
                                        onClick={handleDisable2FA}
                                    >
                                        비활성화
                                    </Button>
                                ) : (
                                    <Button onClick={handleEnable2FA}>
                                        활성화
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                데이터 관리
                            </CardTitle>
                            <CardDescription>
                                개인 데이터를 다운로드하거나 계정을 삭제합니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="font-medium mb-1">데이터 다운로드</div>
                                    <p className="text-sm text-muted-foreground">
                                        주문, 리뷰 등 모든 개인 데이터를 받으세요
                                    </p>
                                </div>
                                <Button variant="outline" onClick={handleDownloadData}>
                                    <Download className="h-4 w-4 mr-2" />
                                    다운로드
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                                <div className="flex-1">
                                    <div className="font-medium mb-1 text-destructive">
                                        계정 삭제
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        계정을 영구적으로 삭제합니다 (30일 유예기간)
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    계정 삭제
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MyPageLayout>
        </>
    );
}
