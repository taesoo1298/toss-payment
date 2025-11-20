import { Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    PlusCircle,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Star,
    TrendingUp,
    Sparkles,
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    lowStockThreshold: number;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    isBestSeller: boolean;
    thumbnailUrl: string | null;
    isInStock: boolean;
    isLowStock: boolean;
    discountPercentage: number | null;
    createdAt: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface CategoryOption {
    value: string;
    label: string;
}

interface Statistics {
    total: number;
    active: number;
    inactive: number;
    low_stock: number;
    out_of_stock: number;
    featured: number;
    new: number;
    best_seller: number;
}

interface Props {
    products: {
        data: Product[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        is_active?: string;
        is_featured?: string;
        is_new?: string;
        is_best_seller?: string;
        stock_status?: string;
    };
    categories: CategoryOption[];
    statistics: Statistics;
}

export default function ProductsIndex({ products, filters, categories, statistics }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        category: filters.category || '',
        brand: filters.brand || '',
        is_active: filters.is_active || '',
        is_featured: filters.is_featured || '',
        is_new: filters.is_new || '',
        is_best_seller: filters.is_best_seller || '',
        stock_status: filters.stock_status || '',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        const params: any = { search };
        Object.entries(selectedFilters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        router.get(route('admin.products.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedFilters({
            category: '',
            brand: '',
            is_active: '',
            is_featured: '',
            is_new: '',
            is_best_seller: '',
            stock_status: '',
        });
        router.get(route('admin.products.index'));
    };

    const handleDelete = (product: Product) => {
        if (confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) {
            router.delete(route('admin.products.destroy', product.id), {
                preserveScroll: true,
            });
        }
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('admin.products.index'),
            { ...filters, search, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getStockBadge = (product: Product) => {
        if (!product.isInStock) {
            return <Badge variant="destructive">품절</Badge>;
        }
        if (product.isLowStock) {
            return <Badge variant="outline" className="border-orange-500 text-orange-600">재고부족</Badge>;
        }
        return <Badge variant="default" className="bg-green-600">정상</Badge>;
    };

    return (
        <AdminLayout header="상품 관리">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            전체 {products.meta.total}개의 상품
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.products.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            상품 등록
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">전체 상품</CardTitle>
                            <Package className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                활성 {statistics.active}개
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">재고 부족</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {statistics.low_stock}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                품절 {statistics.out_of_stock}개
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">추천 상품</CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.featured}</div>
                            <p className="text-xs text-gray-500 mt-1">Featured</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">신상품/베스트</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.new + statistics.best_seller}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                신상 {statistics.new} / 베스트 {statistics.best_seller}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">검색 및 필터</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="search"
                                    placeholder="상품명, SKU로 검색..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    검색
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        카테고리
                                    </label>
                                    <Select
                                        value={selectedFilters.category || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('category', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        재고 상태
                                    </label>
                                    <Select
                                        value={selectedFilters.stock_status || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('stock_status', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in_stock">재고있음</SelectItem>
                                            <SelectItem value="low_stock">재고부족</SelectItem>
                                            <SelectItem value="out_of_stock">품절</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        판매 상태
                                    </label>
                                    <Select
                                        value={selectedFilters.is_active || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('is_active', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">활성</SelectItem>
                                            <SelectItem value="0">비활성</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        특별 표시
                                    </label>
                                    <Select
                                        value={
                                            selectedFilters.is_featured
                                                ? 'featured'
                                                : selectedFilters.is_new
                                                  ? 'new'
                                                  : selectedFilters.is_best_seller
                                                    ? 'best_seller'
                                                    : undefined
                                        }
                                        onValueChange={(value) => {
                                            setSelectedFilters((prev) => ({
                                                ...prev,
                                                is_featured: value === 'featured' ? '1' : '',
                                                is_new: value === 'new' ? '1' : '',
                                                is_best_seller: value === 'best_seller' ? '1' : '',
                                            }));
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="featured">추천 상품</SelectItem>
                                            <SelectItem value="new">신상품</SelectItem>
                                            <SelectItem value="best_seller">베스트셀러</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    필터 초기화
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">이미지</TableHead>
                                <TableHead>상품명</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>카테고리</TableHead>
                                <TableHead className="text-right">가격</TableHead>
                                <TableHead className="text-center">재고</TableHead>
                                <TableHead className="text-center">상태</TableHead>
                                <TableHead className="text-center">특별표시</TableHead>
                                <TableHead>등록일</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center h-32 text-gray-500">
                                        등록된 상품이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.thumbnailUrl ? (
                                                <img
                                                    src={product.thumbnailUrl}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={route('admin.products.show', product.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {product.name}
                                            </Link>
                                            {product.discountPercentage && (
                                                <Badge variant="destructive" className="ml-2 text-xs">
                                                    -{product.discountPercentage}%
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {product.sku || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">{product.category}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    ₩{product.price.toLocaleString()}
                                                </div>
                                                {product.originalPrice && (
                                                    <div className="text-xs text-gray-400 line-through">
                                                        ₩{product.originalPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="space-y-1">
                                                {getStockBadge(product)}
                                                <div className="text-xs text-gray-500">
                                                    {product.stock}개
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                                {product.isActive ? '활성' : '비활성'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col gap-1">
                                                {product.isFeatured && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        추천
                                                    </Badge>
                                                )}
                                                {product.isNew && (
                                                    <Badge variant="outline" className="text-xs bg-blue-50">
                                                        <Sparkles className="h-3 w-3 mr-1" />
                                                        신상
                                                    </Badge>
                                                )}
                                                {product.isBestSeller && (
                                                    <Badge variant="outline" className="text-xs bg-orange-50">
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                        베스트
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.products.show', product.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.products.edit', product.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {products.meta.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {products.meta.current_page} of {products.meta.last_page} (총{' '}
                            {products.meta.total}개)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(products.meta.current_page - 1)}
                                disabled={products.meta.current_page === 1}
                            >
                                이전
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(products.meta.current_page + 1)}
                                disabled={products.meta.current_page === products.meta.last_page}
                            >
                                다음
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
