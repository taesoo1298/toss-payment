import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Calendar, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';

interface Inquiry {
    id: number;
    user_name: string;
    user_email: string;
    category: string;
    subject: string;
    content: string;
    attachments: string[] | null;
    status: string;
    order_id: number | null;
    answer: string | null;
    answered_at: string | null;
    answered_by_name: string | null;
    created_at: string;
}

interface Props {
    inquiry: Inquiry;
}

export default function Show({ inquiry }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        answer: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.inquiries.answer', inquiry.id), {
            onSuccess: () => {
                setData('answer', '');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            pending: { label: '대기', color: 'bg-yellow-100 text-yellow-800' },
            answered: { label: '답변완료', color: 'bg-green-100 text-green-800' },
            closed: { label: '종료', color: 'bg-gray-100 text-gray-800' },
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    return (
        <AdminLayout header="문의 상세">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">문의 상세</h1>
                        <p className="text-sm text-gray-500">문의 내용 및 답변</p>
                    </div>
                    <Link
                        href={route('admin.inquiries.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        목록으로
                    </Link>
                </div>

                {/* 문의 정보 */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                    {inquiry.category}
                                </span>
                                {getStatusBadge(inquiry.status)}
                            </div>
                            <h2 className="text-xl font-semibold">{inquiry.subject}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{inquiry.user_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{inquiry.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{inquiry.created_at}</span>
                        </div>
                        {inquiry.order_id && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MessageSquare className="h-4 w-4" />
                                <span>주문번호: {inquiry.order_id}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">문의 내용</h3>
                        <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                            {inquiry.content}
                        </div>
                    </div>

                    {inquiry.attachments && inquiry.attachments.length > 0 && (
                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">첨부파일</h3>
                            <div className="space-y-2">
                                {inquiry.attachments.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-900 block"
                                    >
                                        {file}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 답변 내용 (이미 답변된 경우) */}
                {inquiry.answer && (
                    <div className="bg-green-50 border border-green-200 shadow rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-900">답변</h3>
                        </div>
                        <div className="text-sm text-gray-900 whitespace-pre-wrap bg-white p-4 rounded">
                            {inquiry.answer}
                        </div>
                        <div className="text-xs text-gray-600 pt-2 border-t">
                            <p>답변자: {inquiry.answered_by_name}</p>
                            <p>답변일: {inquiry.answered_at}</p>
                        </div>
                    </div>
                )}

                {/* 답변 작성 폼 (아직 답변하지 않은 경우) */}
                {inquiry.status === 'pending' && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">답변 작성</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    답변 내용 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.answer}
                                    onChange={(e) => setData('answer', e.target.value)}
                                    rows={8}
                                    className="w-full rounded-md border-gray-300"
                                    placeholder="고객에게 전달할 답변을 작성하세요"
                                />
                                {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? '답변 등록 중...' : '답변 등록'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
