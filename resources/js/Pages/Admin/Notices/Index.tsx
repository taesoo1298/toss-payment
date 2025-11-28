import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Bell, Pin } from 'lucide-react';

interface Notice {
    id: number;
    category: string;
    title: string;
    author_name: string;
    view_count: number;
    is_pinned: boolean;
    is_important: boolean;
    published_at: string;
    created_at: string;
}

interface Props {
    notices: {
        data: Notice[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Index({ notices }: Props) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`"${title}" 공지사항을 삭제하시겠습니까?`)) {
            router.delete(route('admin.notices.destroy', id));
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            '공지': 'bg-blue-100 text-blue-800',
            '이벤트': 'bg-green-100 text-green-800',
            '업데이트': 'bg-purple-100 text-purple-800',
            '점검': 'bg-red-100 text-red-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout header="공지사항 관리">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">공지사항 관리</h1>
                        <p className="text-sm text-gray-500">공지사항을 관리합니다</p>
                    </div>
                    <Link
                        href={route('admin.notices.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        공지사항 등록
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회수</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">발행일</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {notices.data.length > 0 ? (
                                notices.data.map((notice) => (
                                    <tr key={notice.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(notice.category)}`}>
                                                {notice.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {notice.is_pinned && <Pin className="h-4 w-4 text-red-500" />}
                                                {notice.is_important && <span className="text-red-500 font-bold">[중요]</span>}
                                                <span className="max-w-md truncate">{notice.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{notice.author_name}</td>
                                        <td className="px-6 py-4 text-sm">{notice.view_count}</td>
                                        <td className="px-6 py-4 text-sm">{notice.published_at}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.notices.edit', notice.id)} className="text-blue-600 hover:text-blue-900">
                                                    <Edit2 className="h-5 w-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(notice.id, notice.title)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p>등록된 공지사항이 없습니다.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
