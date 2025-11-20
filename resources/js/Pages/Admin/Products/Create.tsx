import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import ProductForm, { ProductFormData } from '@/Components/Admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

interface CategoryOption {
    value: string;
    label: string;
}

interface Props {
    categories: CategoryOption[];
    features: string[];
    targetAudiences: string[];
}

export default function ProductCreate({ categories, features, targetAudiences }: Props) {
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        // 기본 정보
        name: '',
        sku: '',
        barcode: '',
        category: '',
        brand: '',
        short_description: '',

        // 가격 정보
        price: '',
        original_price: '',
        cost_price: '',

        // 재고 정보
        stock: '0',
        low_stock_threshold: '10',

        // 상세 정보
        description: '',
        ingredients: '',
        efficacy: '',
        usage_instructions: '',
        precautions: '',

        // 사양 정보
        volume: '',
        weight: '',
        dimensions: {
            width: undefined,
            height: undefined,
            depth: undefined,
        },

        // 특징 및 대상
        features: [],
        target_audience: [],

        // 이미지
        thumbnail: null,
        product_images: [],
        existing_images: [],

        // 상태
        is_active: true,
        is_featured: false,
        is_new: false,
        is_best_seller: false,

        // 의약외품 정보
        is_quasi_drug: false,
        approval_number: '',
        manufacturer: '',
        distributor: '',

        // SEO
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // FormData 생성 (파일 업로드 처리)
        const formData = new FormData();

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
            } else if (value !== null && value !== undefined && key !== 'existing_images') {
                formData.append(key, String(value));
            }
        });

        router.post(route('admin.products.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                // Success handled by Inertia flash messages
            },
        });
    };

    return (
        <AdminLayout header="상품 등록">
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
                            <h1 className="text-2xl font-bold text-gray-900">새 상품 등록</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                상품 정보를 입력하여 새로운 상품을 등록하세요
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
                                    {processing ? '등록 중...' : '상품 등록'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
