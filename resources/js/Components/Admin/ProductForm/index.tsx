import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent } from '@/Components/ui/card';
import BasicInfoSection from './BasicInfoSection';
import PriceStockSection from './PriceStockSection';
import DetailSection from './DetailSection';
import SpecificationSection from './SpecificationSection';
import ImageSection from './ImageSection';
import StatusSEOSection from './StatusSEOSection';
import { ProductFormProps } from './types';
import {
    Package,
    DollarSign,
    FileText,
    Ruler,
    Image,
    Settings,
} from 'lucide-react';

export default function ProductForm({
    data,
    setData,
    errors,
    categories,
    features,
    targetAudiences,
}: ProductFormProps) {
    const [activeTab, setActiveTab] = useState('basic');

    // 에러가 있는 탭 표시
    const hasErrors = (fields: string[]) => {
        return fields.some((field) => errors[field]);
    };

    const tabsConfig = [
        {
            value: 'basic',
            label: '기본 정보',
            icon: Package,
            errorFields: ['name', 'sku', 'barcode', 'category', 'brand', 'short_description'],
        },
        {
            value: 'price',
            label: '가격/재고',
            icon: DollarSign,
            errorFields: ['price', 'original_price', 'cost_price', 'stock', 'low_stock_threshold'],
        },
        {
            value: 'detail',
            label: '상세 정보',
            icon: FileText,
            errorFields: ['description', 'ingredients', 'efficacy', 'usage_instructions', 'precautions'],
        },
        {
            value: 'spec',
            label: '사양/특징',
            icon: Ruler,
            errorFields: ['volume', 'weight', 'dimensions', 'features', 'target_audience'],
        },
        {
            value: 'images',
            label: '이미지',
            icon: Image,
            errorFields: ['thumbnail', 'product_images'],
        },
        {
            value: 'status',
            label: '상태/SEO',
            icon: Settings,
            errorFields: ['is_active', 'is_featured', 'is_new', 'is_best_seller', 'meta_title'],
        },
    ];

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
                    {tabsConfig.map((tab) => {
                        const Icon = tab.icon;
                        const hasError = hasErrors(tab.errorFields);

                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="relative"
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {tab.label}
                                {hasError && (
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <TabsContent value="basic">
                    <Card>
                        <CardContent className="pt-6">
                            <BasicInfoSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                features={features}
                                targetAudiences={targetAudiences}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="price">
                    <Card>
                        <CardContent className="pt-6">
                            <PriceStockSection
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="detail">
                    <Card>
                        <CardContent className="pt-6">
                            <DetailSection
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="spec">
                    <Card>
                        <CardContent className="pt-6">
                            <SpecificationSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                features={features}
                                targetAudiences={targetAudiences}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="images">
                    <Card>
                        <CardContent className="pt-6">
                            <ImageSection
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="status">
                    <Card>
                        <CardContent className="pt-6">
                            <StatusSEOSection
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Export types for use in pages
export type { ProductFormData, Product } from './types';
