import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import ProductForm, { ProductFormData, Product } from '@/Components/Admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

interface CategoryOption {
    value: string;
    label: string;
}

interface Props {
    product: Product;
    categories: CategoryOption[];
    features: string[];
    targetAudiences: string[];
}

export default function ProductEdit({ product, categories, features, targetAudiences }: Props) {
    const { data, setData, processing, errors } = useForm<ProductFormData>({
        // 기본 정보
        name: product.name,
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category,
        brand: product.brand || '',
        short_description: product.short_description || '',

        // 가격 정보
        price: product.price?.toString() || '',
        original_price: product.original_price?.toString() || '',
        cost_price: product.cost_price?.toString() || '',

        // 재고 정보
        stock: product.stock?.toString() || '0',
        low_stock_threshold: product.low_stock_threshold?.toString() || '10',

        // 상세 정보
        description: product.description || '',
        ingredients: product.ingredients || '',
        efficacy: product.efficacy || '',
        usage_instructions: product.usage_instructions || '',
        precautions: product.precautions || '',

        // 사양 정보
        volume: product.volume || '',
        weight: product.weight?.toString() || '',
        dimensions: product.dimensions || {
            width: undefined,
            height: undefined,
            depth: undefined,
        },

        // 특징 및 대상
        features: product.features || [],
        target_audience: product.target_audience || [],

        // 이미지
        thumbnail: null,
        product_images: [],
        existing_images: product.images || [],

        // 상태
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_new: product.is_new ?? false,
        is_best_seller: product.is_best_seller ?? false,

        // 의약외품 정보
        is_quasi_drug: product.is_quasi_drug ?? false,
        approval_number: product.approval_number || '',
        manufacturer: product.manufacturer || '',
        distributor: product.distributor || '',

        // SEO
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        meta_keywords: product.meta_keywords || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // FormData 생성 (파일 업로드 처리)
        const formData = new FormData();

        // PUT 메서드 스푸핑 (Laravel 요구사항)
        formData.append('_method', 'PUT');

        // 모든 필드를 FormData에 추가
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'thumbnail' && value instanceof File) {
                formData.append('thumbnail', value);
            } else if (key === 'product_images' && Array.isArray(value)) {
                value.forEach((file, index) => {
                    if (file instanceof File) {
                        formData.append(`product_images[${index}]`, file);
                    }
                });
            } else if (key === 'existing_images' && Array.isArray(value)) {
                value.forEach((image, index) => {
                    formData.append(`existing_images[${index}]`, image);
                });
            } else if (key === 'dimensions' && typeof value === 'object' && value !== null) {
                formData.append('dimensions[width]', String(value.width || ''));
                formData.append('dimensions[height]', String(value.height || ''));
                formData.append('dimensions[depth]', String(value.depth || ''));
            } else if (key === 'features' && Array.isArray(value)) {
                value.forEach((feature, index) => {
                    formData.append(`features[${index}]`, feature);
                });
            } else if (key === 'target_audience' && Array.isArray(value)) {
                value.forEach((audience, index) => {
                    formData.append(`target_audience[${index}]`, audience);
                });
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        router.post(route('admin.products.update', product.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                // Success handled by Inertia flash messages
            },
        });
    };

    return (
        <AdminLayout header="상품 수정">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            뒤로
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">상품 수정</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {product.name} - 상품 정보를 수정하세요
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* ProductForm Component */}
                            <ProductForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                features={features}
                                targetAudiences={targetAudiences}
                            />

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                >
                                    취소
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? '수정 중...' : '상품 수정'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
