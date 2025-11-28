import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        category: '공지',
        title: '',
        content: '',
        is_pinned: false,
        is_important: false,
        published_at: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.notices.store'));
    };

    return (
        <AdminLayout header="공지사항 등록">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">공지사항 등록</h1>
                        <p className="text-sm text-gray-500">새로운 공지사항을 등록합니다</p>
                    </div>
                    <Link
                        href={route('admin.notices.index')}
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
                            <option value="공지">공지</option>
                            <option value="이벤트">이벤트</option>
                            <option value="업데이트">업데이트</option>
                            <option value="점검">점검</option>
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-md border-gray-300"
                            placeholder="공지사항 제목을 입력하세요"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={12}
                            className="w-full rounded-md border-gray-300"
                            placeholder="공지사항 내용을 입력하세요"
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_pinned}
                                    onChange={(e) => setData('is_pinned', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">상단 고정</span>
                            </label>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_important}
                                    onChange={(e) => setData('is_important', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">중요 공지</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            발행일시 (비워두면 즉시 발행)
                        </label>
                        <input
                            type="datetime-local"
                            value={data.published_at}
                            onChange={(e) => setData('published_at', e.target.value)}
                            className="w-full rounded-md border-gray-300"
                        />
                        {errors.published_at && <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? '등록 중...' : '공지사항 등록'}
                        </button>
                        <Link
                            href={route('admin.notices.index')}
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
