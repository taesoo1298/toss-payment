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
    Eye,
    Trash2,
    Users,
    ShieldCheck,
    CheckCircle,
    Mail,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    provider: string | null;
    avatar: string | null;
    isAdmin: boolean;
    ordersCount: number;
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
    admins: number;
    verified: number;
    social_login: number;
    email_login: number;
}

interface Props {
    users: {
        data: User[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
        is_admin?: string;
        provider?: string;
        email_verified?: string;
    };
    statistics: Statistics;
}

export default function UsersIndex({ users, filters, statistics }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        is_admin: filters.is_admin || '',
        provider: filters.provider || '',
        email_verified: filters.email_verified || '',
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
        router.get(route('admin.users.index'), params, {
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
            is_admin: '',
            provider: '',
            email_verified: '',
        });
        router.get(route('admin.users.index'));
    };

    const handleDelete = (user: User) => {
        if (user.isAdmin) {
            alert('관리자 계정은 삭제할 수 없습니다.');
            return;
        }
        if (confirm(`"${user.name}" 회원을 삭제하시겠습니까?`)) {
            router.delete(route('admin.users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('admin.users.index'),
            { ...filters, search, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getProviderBadge = (provider: string | null) => {
        if (!provider) return <Badge variant="outline">이메일</Badge>;

        const badges: Record<string, { label: string; variant: any }> = {
            google: { label: 'Google', variant: 'default' },
            kakao: { label: 'Kakao', variant: 'secondary' },
            naver: { label: 'Naver', variant: 'outline' },
        };

        const badge = badges[provider] || { label: provider, variant: 'outline' };
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
    };

    return (
        <AdminLayout header="회원 관리">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            전체 {users.meta.total}명의 회원
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">전체 회원</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                관리자 {statistics.admins}명
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">이메일 인증</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {statistics.verified}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                인증률 {Math.round((statistics.verified / statistics.total) * 100)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">소셜 로그인</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {statistics.social_login}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Google, Kakao, Naver
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">이메일 가입</CardTitle>
                            <Mail className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {statistics.email_login}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">일반 이메일 가입</p>
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
                                    placeholder="이름, 이메일로 검색..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    검색
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        회원 유형
                                    </label>
                                    <Select
                                        value={selectedFilters.is_admin || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('is_admin', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">관리자</SelectItem>
                                            <SelectItem value="0">일반 회원</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        가입 방법
                                    </label>
                                    <Select
                                        value={selectedFilters.provider || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('provider', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">이메일</SelectItem>
                                            <SelectItem value="google">Google</SelectItem>
                                            <SelectItem value="kakao">Kakao</SelectItem>
                                            <SelectItem value="naver">Naver</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        이메일 인증
                                    </label>
                                    <Select
                                        value={selectedFilters.email_verified || undefined}
                                        onValueChange={(value) => {
                                            handleFilterChange('email_verified', value);
                                            setTimeout(applyFilters, 100);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="전체" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">인증 완료</SelectItem>
                                            <SelectItem value="0">미인증</SelectItem>
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
                                <TableHead>회원명</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead className="text-center">가입방법</TableHead>
                                <TableHead className="text-center">이메일 인증</TableHead>
                                <TableHead className="text-center">주문수</TableHead>
                                <TableHead className="text-center">권한</TableHead>
                                <TableHead>가입일</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                                        등록된 회원이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <Link
                                                    href={route('admin.users.show', user.id)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {user.name}
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getProviderBadge(user.provider)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {user.emailVerifiedAt ? (
                                                <Badge variant="default" className="bg-green-600">
                                                    인증완료
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">미인증</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{user.ordersCount}건</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {user.isAdmin ? (
                                                <Badge variant="default">관리자</Badge>
                                            ) : (
                                                <Badge variant="outline">일반</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.users.show', user.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(user)}
                                                    disabled={user.isAdmin}
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
                {users.meta.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {users.meta.current_page} of {users.meta.last_page} (총{' '}
                            {users.meta.total}개)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(users.meta.current_page - 1)}
                                disabled={users.meta.current_page === 1}
                            >
                                이전
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(users.meta.current_page + 1)}
                                disabled={users.meta.current_page === users.meta.last_page}
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
