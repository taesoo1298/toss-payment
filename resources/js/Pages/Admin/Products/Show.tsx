import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    DollarSign,
    Tag,
    Star,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Calendar,
    Users,
    Sparkles,
    TrendingUp,
} from "lucide-react";

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    barcode: string | null;
    price: number;
    originalPrice: number | null;
    costPrice: number | null;
    category_id: number | null;
    brand: string | null;
    description: string | null;
    shortDescription: string | null;
    ingredients: string | null;
    efficacy: string | null;
    usageInstructions: string | null;
    precautions: string | null;
    volume: string | null;
    weight: number | null;
    dimensions: any | null;
    features: string[] | null;
    targetAudience: string[] | null;
    rating: number;
    reviewCount: number;
    stock: number;
    lowStockThreshold: number;
    soldCount: number;
    thumbnailUrl: string | null;
    images: string[] | null;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    isBestSeller: boolean;
    isQuasiDrug: boolean;
    approvalNumber: string | null;
    manufacturer: string | null;
    distributor: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    discountPercentage: number | null;
    isInStock: boolean;
    isLowStock: boolean;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    console.log(typeof product.features);
    const handleDelete = () => {
        if (confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) {
            router.delete(route("admin.products.destroy", product.id));
        }
    };

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`;
    };

    const getStockBadge = () => {
        if (!product.isInStock) {
            return <Badge variant="destructive">품절</Badge>;
        }
        if (product.isLowStock) {
            return (
                <Badge variant="default" className="bg-yellow-600">
                    재고부족
                </Badge>
            );
        }
        return (
            <Badge variant="default" className="bg-green-600">
                재고있음
            </Badge>
        );
    };

    return (
        <AdminLayout header="상품 상세">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route("admin.products.index")}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                목록
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {product.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                SKU: {product.sku}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route("admin.products.edit", product.id)}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                수정
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                재고
                            </CardTitle>
                            <Package className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {product.stock}개
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                {getStockBadge()}
                                <span className="text-xs text-gray-500">
                                    임계값: {product.lowStockThreshold}개
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                판매량
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {product.soldCount}개
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                총 판매 건수
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                평점
                            </CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Number(product.rating).toFixed(1)}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {product.reviewCount}개의 리뷰
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                기본 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">상품명</div>
                                <div className="font-medium">
                                    {product.name}
                                </div>

                                <div className="text-gray-500">SKU</div>
                                <div className="font-mono">{product.sku}</div>

                                {product.barcode && (
                                    <>
                                        <div className="text-gray-500">
                                            바코드
                                        </div>
                                        <div className="font-mono">
                                            {product.barcode}
                                        </div>
                                    </>
                                )}

                                <div className="text-gray-500">브랜드</div>
                                <div>{product.brand || "-"}</div>

                                <div className="text-gray-500">카테고리 ID</div>
                                <div>{product.category_id || "-"}</div>

                                <div className="text-gray-500">용량</div>
                                <div>{product.volume || "-"}</div>

                                {product.weight && (
                                    <>
                                        <div className="text-gray-500">
                                            무게
                                        </div>
                                        <div>{product.weight}g</div>
                                    </>
                                )}

                                <div className="text-gray-500">상태</div>
                                <div className="flex flex-wrap gap-1">
                                    {product.isActive ? (
                                        <Badge
                                            variant="default"
                                            className="bg-green-600"
                                        >
                                            활성
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">비활성</Badge>
                                    )}
                                    {product.isFeatured && (
                                        <Badge
                                            variant="default"
                                            className="bg-purple-600"
                                        >
                                            추천
                                        </Badge>
                                    )}
                                    {product.isNew && (
                                        <Badge
                                            variant="default"
                                            className="bg-blue-600"
                                        >
                                            신상품
                                        </Badge>
                                    )}
                                    {product.isBestSeller && (
                                        <Badge
                                            variant="default"
                                            className="bg-orange-600"
                                        >
                                            베스트
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                가격 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">판매가</div>
                                <div className="font-bold text-lg">
                                    {formatPrice(product.price)}
                                </div>

                                {product.originalPrice && (
                                    <>
                                        <div className="text-gray-500">
                                            정가
                                        </div>
                                        <div className="line-through text-gray-500">
                                            {formatPrice(product.originalPrice)}
                                        </div>

                                        <div className="text-gray-500">
                                            할인율
                                        </div>
                                        <div className="text-red-600 font-bold">
                                            {product.discountPercentage}%
                                        </div>
                                    </>
                                )}

                                {product.costPrice && (
                                    <>
                                        <div className="text-gray-500">
                                            원가
                                        </div>
                                        <div>
                                            {formatPrice(product.costPrice)}
                                        </div>
                                    </>
                                )}
                            </div>

                            {product.originalPrice && (
                                <div className="pt-3 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            절감금액
                                        </span>
                                        <span className="font-bold text-red-600">
                                            {formatPrice(
                                                product.originalPrice -
                                                    product.price
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {product.thumbnailUrl && (
                    <Card>
                        <CardHeader>
                            <CardTitle>상품 이미지</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="relative aspect-square rounded-lg overflow-hidden border">
                                    <img
                                        src={product.thumbnailUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <Badge
                                        className="absolute top-2 left-2"
                                        variant="secondary"
                                    >
                                        대표
                                    </Badge>
                                </div>
                                {product.images?.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-lg overflow-hidden border"
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>상품 설명</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {product.shortDescription && (
                            <div>
                                <h3 className="font-medium mb-2">간단 설명</h3>
                                <p className="text-gray-700">
                                    {product.shortDescription}
                                </p>
                            </div>
                        )}

                        {product.description && (
                            <div>
                                <h3 className="font-medium mb-2">상세 설명</h3>
                                <div className="text-gray-700 whitespace-pre-wrap">
                                    {product.description}
                                </div>
                            </div>
                        )}

                        {product.features && product.features.length > 0 && (
                            <div>
                                <h3 className="font-medium mb-2">주요 특징</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.features.map((feature, index) => (
                                        <Badge key={index} variant="outline">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.targetAudience &&
                            product.targetAudience.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-2">대상</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.targetAudience.map(
                                            (audience, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                >
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {audience}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </CardContent>
                </Card>

                {(product.ingredients ||
                    product.efficacy ||
                    product.usageInstructions ||
                    product.precautions) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>상세 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.ingredients && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        성분 정보
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {product.ingredients}
                                    </p>
                                </div>
                            )}

                            {product.efficacy && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        효능·효과
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {product.efficacy}
                                    </p>
                                </div>
                            )}

                            {product.usageInstructions && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        사용 방법
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {product.usageInstructions}
                                    </p>
                                </div>
                            )}

                            {product.precautions && (
                                <div>
                                    <h3 className="font-medium mb-2">
                                        주의사항
                                    </h3>
                                    <p className="text-gray-700 text-red-600 whitespace-pre-wrap">
                                        {product.precautions}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {product.isQuasiDrug && (
                    <Card>
                        <CardHeader>
                            <CardTitle>의약외품 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">
                                    의약외품 여부
                                </div>
                                <div>
                                    <Badge
                                        variant="default"
                                        className="bg-purple-600"
                                    >
                                        의약외품
                                    </Badge>
                                </div>

                                {product.approvalNumber && (
                                    <>
                                        <div className="text-gray-500">
                                            허가번호
                                        </div>
                                        <div className="font-mono">
                                            {product.approvalNumber}
                                        </div>
                                    </>
                                )}

                                {product.manufacturer && (
                                    <>
                                        <div className="text-gray-500">
                                            제조사
                                        </div>
                                        <div>{product.manufacturer}</div>
                                    </>
                                )}

                                {product.distributor && (
                                    <>
                                        <div className="text-gray-500">
                                            판매원
                                        </div>
                                        <div>{product.distributor}</div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {(product.metaTitle ||
                    product.metaDescription ||
                    product.metaKeywords) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {product.metaTitle && (
                                <div>
                                    <h3 className="font-medium mb-1 text-sm text-gray-500">
                                        메타 제목
                                    </h3>
                                    <p className="text-gray-700">
                                        {product.metaTitle}
                                    </p>
                                </div>
                            )}

                            {product.metaDescription && (
                                <div>
                                    <h3 className="font-medium mb-1 text-sm text-gray-500">
                                        메타 설명
                                    </h3>
                                    <p className="text-gray-700">
                                        {product.metaDescription}
                                    </p>
                                </div>
                            )}

                            {product.metaKeywords && (
                                <div>
                                    <h3 className="font-medium mb-1 text-sm text-gray-500">
                                        메타 키워드
                                    </h3>
                                    <p className="text-gray-700">
                                        {product.metaKeywords}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            시간 정보
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">등록일</div>
                            <div>
                                {new Date(product.createdAt).toLocaleString(
                                    "ko-KR"
                                )}
                            </div>

                            <div className="text-gray-500">수정일</div>
                            <div>
                                {new Date(product.updatedAt).toLocaleString(
                                    "ko-KR"
                                )}
                            </div>

                            {product.publishedAt && (
                                <>
                                    <div className="text-gray-500">출시일</div>
                                    <div>
                                        {new Date(
                                            product.publishedAt
                                        ).toLocaleString("ko-KR")}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
