import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { ProductFormProps } from './types';
import { Settings, Search, AlertCircle } from 'lucide-react';

export default function StatusSEOSection({
    data,
    setData,
    errors,
}: Omit<ProductFormProps, 'categories' | 'features' | 'targetAudiences'>) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    상태 및 SEO 설정
                </h3>
                <p className="text-sm text-gray-500">
                    판매 상태, 특별 표시, SEO 설정을 관리하세요.
                </p>
            </div>

            {/* 판매 상태 */}
            <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm text-gray-700">판매 상태</h4>

                <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked as boolean)
                            }
                        />
                        <div>
                            <span className="text-sm font-medium">활성화</span>
                            <p className="text-xs text-gray-500">
                                체크하면 고객에게 상품이 표시됩니다
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* 특별 표시 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700">특별 표시</h4>
                    <p className="text-xs text-gray-500 mt-1">
                        상품에 특별 배지를 표시할 수 있습니다
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                            checked={data.is_featured}
                            onCheckedChange={(checked) =>
                                setData('is_featured', checked as boolean)
                            }
                        />
                        <div>
                            <span className="text-sm font-medium">⭐ 추천 상품</span>
                            <p className="text-xs text-gray-500">Featured</p>
                        </div>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                            checked={data.is_new}
                            onCheckedChange={(checked) =>
                                setData('is_new', checked as boolean)
                            }
                        />
                        <div>
                            <span className="text-sm font-medium">✨ 신상품</span>
                            <p className="text-xs text-gray-500">New Arrival</p>
                        </div>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                            checked={data.is_best_seller}
                            onCheckedChange={(checked) =>
                                setData('is_best_seller', checked as boolean)
                            }
                        />
                        <div>
                            <span className="text-sm font-medium">🔥 베스트셀러</span>
                            <p className="text-xs text-gray-500">Best Seller</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* 의약외품 정보 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        의약외품 정보
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        의약외품인 경우 아래 정보를 입력해주세요
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                            checked={data.is_quasi_drug}
                            onCheckedChange={(checked) =>
                                setData('is_quasi_drug', checked as boolean)
                            }
                        />
                        <span className="text-sm font-medium">의약외품입니다</span>
                    </label>

                    {data.is_quasi_drug && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                            <div>
                                <Label htmlFor="approval_number">허가번호</Label>
                                <Input
                                    id="approval_number"
                                    value={data.approval_number || ''}
                                    onChange={(e) =>
                                        setData('approval_number', e.target.value)
                                    }
                                    className="mt-1"
                                    placeholder="예: 제2021-1234호"
                                />
                            </div>

                            <div>
                                <Label htmlFor="manufacturer">제조사</Label>
                                <Input
                                    id="manufacturer"
                                    value={data.manufacturer || ''}
                                    onChange={(e) =>
                                        setData('manufacturer', e.target.value)
                                    }
                                    className="mt-1"
                                    placeholder="제조사명"
                                />
                            </div>

                            <div>
                                <Label htmlFor="distributor">판매원</Label>
                                <Input
                                    id="distributor"
                                    value={data.distributor || ''}
                                    onChange={(e) =>
                                        setData('distributor', e.target.value)
                                    }
                                    className="mt-1"
                                    placeholder="판매원명"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SEO 설정 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        SEO 설정
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        검색 엔진 최적화를 위한 정보를 입력하세요
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="meta_title">메타 제목</Label>
                        <Input
                            id="meta_title"
                            value={data.meta_title || ''}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            className="mt-1"
                            placeholder="검색 결과에 표시될 제목 (비워두면 상품명 사용)"
                            maxLength={255}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {data.meta_title?.length || 0} / 255자
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="meta_description">메타 설명</Label>
                        <Textarea
                            id="meta_description"
                            value={data.meta_description || ''}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            className="mt-1"
                            rows={3}
                            placeholder="검색 결과에 표시될 설명 (비워두면 짧은 설명 사용)"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {data.meta_description?.length || 0} / 500자
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="meta_keywords">메타 키워드</Label>
                        <Input
                            id="meta_keywords"
                            value={data.meta_keywords || ''}
                            onChange={(e) => setData('meta_keywords', e.target.value)}
                            className="mt-1"
                            placeholder="쉼표로 구분된 키워드 (예: 치약, 미백, 잇몸케어)"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            쉼표(,)로 구분하여 입력
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
