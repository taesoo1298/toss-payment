import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { ProductFormProps } from './types';

export default function BasicInfoSection({
    data,
    setData,
    errors,
    categories,
}: ProductFormProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">기본 정보</h3>
                <p className="text-sm text-gray-500">
                    상품의 기본 정보를 입력해주세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 상품명 */}
                <div className="md:col-span-2">
                    <Label htmlFor="name">
                        상품명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1"
                        placeholder="예: Dr.Smile 프리미엄 미백 치약"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                </div>

                {/* SKU */}
                <div>
                    <Label htmlFor="sku">SKU (재고관리코드)</Label>
                    <Input
                        id="sku"
                        value={data.sku || ''}
                        onChange={(e) => setData('sku', e.target.value)}
                        className="mt-1"
                        placeholder="비워두면 자동 생성됩니다"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        예: PRD-ABC12345 (비워두면 자동 생성)
                    </p>
                    {errors.sku && (
                        <p className="text-sm text-red-600 mt-1">{errors.sku}</p>
                    )}
                </div>

                {/* 바코드 */}
                <div>
                    <Label htmlFor="barcode">바코드</Label>
                    <Input
                        id="barcode"
                        value={data.barcode || ''}
                        onChange={(e) => setData('barcode', e.target.value)}
                        className="mt-1"
                        placeholder="제품 바코드 번호"
                    />
                    {errors.barcode && (
                        <p className="text-sm text-red-600 mt-1">{errors.barcode}</p>
                    )}
                </div>

                {/* 카테고리 */}
                <div>
                    <Label htmlFor="category">
                        카테고리 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.category}
                        onValueChange={(value) => setData('category', value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                    )}
                </div>

                {/* 브랜드 */}
                <div>
                    <Label htmlFor="brand">브랜드</Label>
                    <Input
                        id="brand"
                        value={data.brand}
                        onChange={(e) => setData('brand', e.target.value)}
                        className="mt-1"
                        placeholder="Dr.Smile"
                    />
                    {errors.brand && (
                        <p className="text-sm text-red-600 mt-1">{errors.brand}</p>
                    )}
                </div>

                {/* 짧은 설명 */}
                <div className="md:col-span-2">
                    <Label htmlFor="short_description">짧은 설명 (한 줄 소개)</Label>
                    <Input
                        id="short_description"
                        value={data.short_description || ''}
                        onChange={(e) => setData('short_description', e.target.value)}
                        className="mt-1"
                        placeholder="상품의 핵심 특징을 한 줄로 요약해주세요 (최대 500자)"
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {data.short_description?.length || 0} / 500자
                    </p>
                    {errors.short_description && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.short_description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
