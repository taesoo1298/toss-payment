import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { ProductFormProps } from './types';
import { FileText } from 'lucide-react';

export default function DetailSection({
    data,
    setData,
    errors,
}: Omit<ProductFormProps, 'categories' | 'features' | 'targetAudiences'>) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    상세 정보
                </h3>
                <p className="text-sm text-gray-500">
                    상품의 상세 설명과 사용 정보를 입력해주세요.
                </p>
            </div>

            <div className="space-y-6">
                {/* 상품 설명 */}
                <div>
                    <Label htmlFor="description">상품 설명</Label>
                    <Textarea
                        id="description"
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1"
                        rows={6}
                        placeholder="상품에 대한 자세한 설명을 입력해주세요..."
                    />
                    {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                    )}
                </div>

                {/* 성분 정보 */}
                <div>
                    <Label htmlFor="ingredients">성분 정보</Label>
                    <Textarea
                        id="ingredients"
                        value={data.ingredients || ''}
                        onChange={(e) => setData('ingredients', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="주요 성분과 함량을 입력해주세요..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        예: 불소 1,450ppm, 천연 미백 성분, 자일리톨 등
                    </p>
                    {errors.ingredients && (
                        <p className="text-sm text-red-600 mt-1">{errors.ingredients}</p>
                    )}
                </div>

                {/* 효능 */}
                <div>
                    <Label htmlFor="efficacy">효능</Label>
                    <Textarea
                        id="efficacy"
                        value={data.efficacy || ''}
                        onChange={(e) => setData('efficacy', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="제품의 주요 효능을 입력해주세요..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        예: 치아 미백, 잇몸 건강, 충치 예방, 구취 제거 등
                    </p>
                    {errors.efficacy && (
                        <p className="text-sm text-red-600 mt-1">{errors.efficacy}</p>
                    )}
                </div>

                {/* 사용 방법 */}
                <div>
                    <Label htmlFor="usage_instructions">사용 방법</Label>
                    <Textarea
                        id="usage_instructions"
                        value={data.usage_instructions || ''}
                        onChange={(e) => setData('usage_instructions', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="제품 사용 방법을 입력해주세요..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        예: 하루 3회, 식후 3분 이내 양치, 적당량을 칫솔에 짜서 사용 등
                    </p>
                    {errors.usage_instructions && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.usage_instructions}
                        </p>
                    )}
                </div>

                {/* 주의사항 */}
                <div>
                    <Label htmlFor="precautions">주의사항</Label>
                    <Textarea
                        id="precautions"
                        value={data.precautions || ''}
                        onChange={(e) => setData('precautions', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="사용 시 주의사항을 입력해주세요..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        예: 6세 이하 어린이 사용 시 주의, 과다 섭취 금지, 알레르기 성분 등
                    </p>
                    {errors.precautions && (
                        <p className="text-sm text-red-600 mt-1">{errors.precautions}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
