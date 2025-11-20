import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { ProductFormProps } from './types';
import { Ruler, Tags } from 'lucide-react';

export default function SpecificationSection({
    data,
    setData,
    errors,
    features,
    targetAudiences,
}: Omit<ProductFormProps, 'categories'>) {
    const toggleFeature = (feature: string) => {
        const current = data.features || [];
        if (current.includes(feature)) {
            setData(
                'features',
                current.filter((f) => f !== feature)
            );
        } else {
            setData('features', [...current, feature]);
        }
    };

    const toggleTargetAudience = (audience: string) => {
        const current = data.target_audience || [];
        if (current.includes(audience)) {
            setData(
                'target_audience',
                current.filter((a) => a !== audience)
            );
        } else {
            setData('target_audience', [...current, audience]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    사양 및 특징
                </h3>
                <p className="text-sm text-gray-500">
                    상품의 사양 정보와 특징을 설정해주세요.
                </p>
            </div>

            {/* 사양 정보 */}
            <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm text-gray-700">사양 정보</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 용량 */}
                    <div>
                        <Label htmlFor="volume">용량</Label>
                        <Input
                            id="volume"
                            value={data.volume || ''}
                            onChange={(e) => setData('volume', e.target.value)}
                            className="mt-1"
                            placeholder="예: 100g, 150ml"
                        />
                        {errors.volume && (
                            <p className="text-sm text-red-600 mt-1">{errors.volume}</p>
                        )}
                    </div>

                    {/* 무게 */}
                    <div>
                        <Label htmlFor="weight">무게 (g)</Label>
                        <Input
                            id="weight"
                            type="number"
                            value={data.weight || ''}
                            onChange={(e) => setData('weight', e.target.value)}
                            className="mt-1"
                            placeholder="예: 120"
                            min="0"
                            step="0.1"
                        />
                        {errors.weight && (
                            <p className="text-sm text-red-600 mt-1">{errors.weight}</p>
                        )}
                    </div>
                </div>

                {/* 크기 */}
                <div>
                    <Label>크기 (가로 x 세로 x 높이, cm)</Label>
                    <div className="grid grid-cols-3 gap-4 mt-1">
                        <div>
                            <Input
                                type="number"
                                value={data.dimensions?.width || ''}
                                onChange={(e) =>
                                    setData('dimensions', {
                                        ...data.dimensions,
                                        width: parseFloat(e.target.value) || undefined,
                                    })
                                }
                                placeholder="가로"
                                min="0"
                                step="0.1"
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                value={data.dimensions?.height || ''}
                                onChange={(e) =>
                                    setData('dimensions', {
                                        ...data.dimensions,
                                        height: parseFloat(e.target.value) || undefined,
                                    })
                                }
                                placeholder="세로"
                                min="0"
                                step="0.1"
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                value={data.dimensions?.depth || ''}
                                onChange={(e) =>
                                    setData('dimensions', {
                                        ...data.dimensions,
                                        depth: parseFloat(e.target.value) || undefined,
                                    })
                                }
                                placeholder="높이"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 제품 특징 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                        <Tags className="h-4 w-4" />
                        제품 특징
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        해당하는 특징을 모두 선택하세요
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {features.map((feature) => (
                        <label
                            key={feature}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={data.features?.includes(feature) || false}
                                onCheckedChange={() => toggleFeature(feature)}
                            />
                            <span className="text-sm">{feature}</span>
                        </label>
                    ))}
                </div>
                {errors.features && (
                    <p className="text-sm text-red-600">{errors.features}</p>
                )}
            </div>

            {/* 대상 고객 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700">대상 고객</h4>
                    <p className="text-xs text-gray-500 mt-1">
                        제품을 사용할 수 있는 대상을 선택하세요
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {targetAudiences.map((audience) => (
                        <label
                            key={audience}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={
                                    data.target_audience?.includes(audience) || false
                                }
                                onCheckedChange={() => toggleTargetAudience(audience)}
                            />
                            <span className="text-sm">{audience}</span>
                        </label>
                    ))}
                </div>
                {errors.target_audience && (
                    <p className="text-sm text-red-600">{errors.target_audience}</p>
                )}
            </div>
        </div>
    );
}
