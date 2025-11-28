import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { MessageSquare, Trash2 } from 'lucide-react';

interface Inquiry {
    id: number;
    user_name: string;
    user_email: string;
    category: string;
    subject: string;
    status: string;
    order_id: number | null;
    created_at: string;
}

interface Props {
    inquiries: {
        data: Inquiry[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Index({ inquiries }: Props) {
    const handleDelete = (id: number, subject: string) => {
        if (confirm(`"${subject}" 문의를 삭제하시겠습니까?`)) {
            router.delete(route('admin.inquiries.destroy', id));
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            pending: { label: '대기', color: 'bg-yellow-100 text-yellow-800' },
            answered: { label: '답변완료', color: 'bg-green-100 text-green-800' },
            closed: { label: '종료', color: 'bg-gray-100 text-gray-800' },
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            '주문/배송': 'bg-blue-100 text-blue-800',
            '결제': 'bg-green-100 text-green-800',
            '회원': 'bg-purple-100 text-purple-800',
            '상품': 'bg-orange-100 text-orange-800',
            '기타': 'bg-gray-100 text-gray-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout header="문의 관리">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">문의 관리</h1>
                        <p className="text-sm text-gray-500">고객 문의를 관리합니다</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.data.length > 0 ? (
                                inquiries.data.map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(inquiry.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(inquiry.category)}`}>
                                                {inquiry.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={route('admin.inquiries.show', inquiry.id)}
                                                className="text-blue-600 hover:text-blue-900 max-w-md truncate block"
                                            >
                                                {inquiry.subject}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div>
                                                <p className="font-medium">{inquiry.user_name}</p>
                                                <p className="text-xs text-gray-500">{inquiry.user_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{inquiry.created_at}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(inquiry.id, inquiry.subject)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p>등록된 문의가 없습니다.</p>
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
