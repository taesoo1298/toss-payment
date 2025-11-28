import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        category: '주문/배송',
        question: '',
        answer: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.faqs.store'));
    };

    return (
        <AdminLayout header="FAQ 등록">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">FAQ 등록</h1>
                        <p className="text-sm text-gray-500">새로운 FAQ를 등록합니다</p>
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
                            placeholder="예: 배송은 얼마나 걸리나요?"
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
                            placeholder="FAQ 답변을 입력하세요"
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
                            {processing ? '등록 중...' : 'FAQ 등록'}
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
