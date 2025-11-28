import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Faq {
    id: number;
    category: string;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

interface Props {
    faq: Faq;
}

export default function Edit({ faq }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        is_active: faq.is_active,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.faqs.update', faq.id));
    };

    return (
        <AdminLayout header="FAQ 수정">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">FAQ 수정</h1>
                        <p className="text-sm text-gray-500">FAQ 정보를 수정합니다</p>
                    </div>
                    <Link
                        href={route('admin.faqs.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        목록으로
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            카테고리 <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full rounded-md border-gray-300"
                        >
                            <option value="주문/배송">주문/배송</option>
                            <option value="결제">결제</option>
                            <option value="회원">회원</option>
                            <option value="상품">상품</option>
                            <option value="기타">기타</option>
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            질문 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.question}
                            onChange={(e) => setData('question', e.target.value)}
                            className="w-full rounded-md border-gray-300"
                        />
                        {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            답변 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.answer}
                            onChange={(e) => setData('answer', e.target.value)}
                            rows={8}
                            className="w-full rounded-md border-gray-300"
                        />
                        {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                순서
                            </label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value))}
                                className="w-full rounded-md border-gray-300"
                                min="0"
                            />
                            {errors.order && <p className="mt-1 text-sm text-red-600">{errors.order}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                상태
                            </label>
                            <select
                                value={data.is_active ? '1' : '0'}
                                onChange={(e) => setData('is_active', e.target.value === '1')}
                                className="w-full rounded-md border-gray-300"
                            >
                                <option value="1">활성</option>
                                <option value="0">비활성</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? '수정 중...' : '수정 완료'}
                        </button>
                        <Link
                            href={route('admin.faqs.index')}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            취소
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
