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
    Search,
    Trash2,
    Star,
    MessageSquare,
    CheckCircle,
    XCircle,
    Image,
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    thumbnailUrl: string | null;
}

interface User {
    id: number;
    name: string;
    maskedName: string;
    email: string;
}

interface Review {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    content: string;
    images: string[];
    isVerified: boolean;
    product: Product;
    user: User;
    createdAt: string;
    updatedAt: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Statistics {
    total: number;
    verified: number;
    unverified: number;
    average_rating: number;
    rating_5: number;
    rating_4: number;
    rating_3: number;
    rating_2: number;
    rating_1: number;
}

interface Props {
    reviews: {
        data: Review[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
        rating?: string;
        is_verified?: string;
    };
    statistics: Statistics;
}

export default function ReviewsIndex({ reviews, filters, statistics }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        rating: filters.rating || '',
        is_verified: filters.is_verified || '',
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
        router.get(route('admin.reviews.index'), params, {
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
            rating: '',
            is_verified: '',
        });
        router.get(route('admin.reviews.index'));
    };

    const handleDelete = (review: Review) => {
        if (confirm('리뷰를 삭제하시겠습니까?')) {
            router.delete(route('admin.reviews.destroy', review.id), {
                preserveScroll: true,
            });
        }
    };

    const handleApprove = (review: Review) => {
        router.put(
            route('admin.reviews.approve', review.id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('admin.reviews.index'),
            { ...filters, search, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <AdminLayout header="리뷰 관리">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            전체 {reviews.meta.total}개의 리뷰
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">전체 리뷰</CardTitle>
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                평균 평점 {statistics.average_rating || 0}점
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">인증 리뷰</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.verified}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">구매 확인 리뷰</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">미인증</CardTitle>
                            <XCircle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {statistics.unverified}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">일반 리뷰</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">평점 분포</CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>5점</span>
                                    <span className="font-medium">{statistics.rating_5}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>4점</span>
                                    <span className="font-medium">{statistics.rating_4}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>3점 이하</span>
                                    <span className="font-medium">
                                        {statistics.rating_3 +
                                            statistics.rating_2 +
                                            statistics.rating_1}
                                    </span>
                                </div>
                            </div>
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
                                    placeholder="리뷰 내용, 작성자, 상품명으로 검색..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    검색
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">평점</label>
                                    <Select
                                        value={selectedFilters.rating || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('rating', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5점</SelectItem>
                                            <SelectItem value="4">4점</SelectItem>
                                            <SelectItem value="3">3점</SelectItem>
                                            <SelectItem value="2">2점</SelectItem>
                                            <SelectItem value="1">1점</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        인증 여부
                                    </label>
                                    <Select
                                        value={selectedFilters.is_verified || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('is_verified', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">인증 리뷰</SelectItem>
                                            <SelectItem value="0">미인증 리뷰</SelectItem>
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
                                <TableHead>상품</TableHead>
                                <TableHead>작성자</TableHead>
                                <TableHead className="text-center">평점</TableHead>
                                <TableHead>리뷰 내용</TableHead>
                                <TableHead className="text-center">이미지</TableHead>
                                <TableHead className="text-center">인증</TableHead>
                                <TableHead>작성일</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                                        등록된 리뷰가 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reviews.data.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {review.product.thumbnailUrl ? (
                                                    <img
                                                        src={review.product.thumbnailUrl}
                                                        alt={review.product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                        <MessageSquare className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="max-w-[200px]">
                                                    <div className="font-medium text-sm truncate">
                                                        {review.product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {review.user.maskedName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {review.user.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-0.5">
                                                {renderStars(review.rating)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[300px]">
                                                <p className="text-sm line-clamp-2">{review.content}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {review.images.length > 0 ? (
                                                <Badge variant="outline">
                                                    <Image className="h-3 w-3 mr-1" />
                                                    {review.images.length}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {review.isVerified ? (
                                                <Badge variant="default" className="bg-green-600">
                                                    구매확인
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">일반</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                {!review.isVerified && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleApprove(review)}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        승인
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(review)}
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
                {reviews.meta.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {reviews.meta.current_page} of {reviews.meta.last_page} (총{' '}
                            {reviews.meta.total}개)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(reviews.meta.current_page - 1)}
                                disabled={reviews.meta.current_page === 1}
                            >
                                이전
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(reviews.meta.current_page + 1)}
                                disabled={reviews.meta.current_page === reviews.meta.last_page}
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
