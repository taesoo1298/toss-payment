import { router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Save, Settings as SettingsIcon } from 'lucide-react';

interface Setting {
    id: number;
    key: string;
    value: string | number | boolean;
    type: 'string' | 'number' | 'boolean' | 'json';
    label: string;
    description: string | null;
}

interface SettingsGroup {
    [key: string]: Setting[];
}

interface Props {
    settings: SettingsGroup;
}

const groupLabels: Record<string, string> = {
    general: '사이트 설정',
    shipping: '배송 설정',
    point: '포인트 설정',
    order: '주문 설정',
    notification: '알림 설정',
};

const groupDescriptions: Record<string, string> = {
    general: '사이트의 기본 정보를 설정합니다',
    shipping: '배송비 및 배송 정책을 설정합니다',
    point: '포인트 적립 및 사용 정책을 설정합니다',
    order: '주문 및 반품 정책을 설정합니다',
    notification: '알림 발송 설정을 관리합니다',
};

export default function SettingsIndex({ settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        Object.values(settings).forEach((groupSettings) => {
            groupSettings.forEach((setting) => {
                initial[setting.key] = setting.value;
            });
        });
        return initial;
    });

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const settingsArray = Object.entries(formData).map(([key, value]) => ({
            key,
            value,
        }));

        router.post(
            route('admin.settings.update'),
            { settings: settingsArray },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Success message will be shown via flash message
                },
            }
        );
    };

    const renderInput = (setting: Setting) => {
        switch (setting.type) {
            case 'boolean':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={setting.key}
                            checked={!!formData[setting.key]}
                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={setting.key} className="cursor-pointer">
                            {setting.label}
                        </Label>
                    </div>
                );

            case 'number':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Input
                            id={setting.key}
                            type="number"
                            value={formData[setting.key] || ''}
                            onChange={(e) => handleChange(setting.key, parseInt(e.target.value) || 0)}
                        />
                        {setting.description && (
                            <p className="text-xs text-gray-500">{setting.description}</p>
                        )}
                    </div>
                );

            case 'string':
            default:
                // Check if it's a long text (contains newlines or description mentions policy)
                const isLongText = setting.key.includes('policy') ||
                                   setting.label.includes('정책') ||
                                   (typeof formData[setting.key] === 'string' && formData[setting.key].includes('\n'));

                if (isLongText) {
                    return (
                        <div className="space-y-2">
                            <Label htmlFor={setting.key}>{setting.label}</Label>
                            <Textarea
                                id={setting.key}
                                value={formData[setting.key] || ''}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                rows={5}
                            />
                            {setting.description && (
                                <p className="text-xs text-gray-500">{setting.description}</p>
                            )}
                        </div>
                    );
                }

                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Input
                            id={setting.key}
                            type="text"
                            value={formData[setting.key] || ''}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                        />
                        {setting.description && (
                            <p className="text-xs text-gray-500">{setting.description}</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <AdminLayout header="설정">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <SettingsIcon className="h-6 w-6" />
                            설정
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            사이트 운영에 필요한 설정을 관리합니다
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.entries(settings).map(([groupKey, groupSettings]) => (
                        <Card key={groupKey}>
                            <CardHeader>
                                <CardTitle>{groupLabels[groupKey] || groupKey}</CardTitle>
                                {groupDescriptions[groupKey] && (
                                    <CardDescription>{groupDescriptions[groupKey]}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {groupSettings.map((setting) => (
                                    <div key={setting.key}>
                                        {renderInput(setting)}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end">
                        <Button type="submit" size="lg">
                            <Save className="h-4 w-4 mr-2" />
                            설정 저장
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
