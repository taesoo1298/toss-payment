import { Head, Link } from '@inertiajs/react';

interface FailProps {
    code?: string;
    message?: string;
    orderId?: string;
}

export default function Fail({ code, message, orderId }: FailProps) {
    return (
        <>
            <Head title="결제 실패" />

            <div className="min-h-screen bg-gray-100 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-6xl mb-6">❌</div>
                        <h1 className="text-3xl font-bold text-red-600 mb-4">결제에 실패했습니다</h1>
                        <p className="text-gray-600 mb-8">
                            결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.
                        </p>

                        <div className="bg-red-50 rounded-lg p-6 mb-8 text-left">
                            <div className="space-y-4">
                                {orderId && (
                                    <div className="flex justify-between py-3 border-b border-red-200">
                                        <span className="text-gray-600 font-medium">주문번호</span>
                                        <span className="text-gray-900 font-semibold">
                                            {orderId}
                                        </span>
                                    </div>
                                )}
                                {code && (
                                    <div className="flex justify-between py-3 border-b border-red-200">
                                        <span className="text-gray-600 font-medium">오류 코드</span>
                                        <span className="text-gray-900 font-semibold">{code}</span>
                                    </div>
                                )}
                                {message && (
                                    <div className="flex justify-between py-3">
                                        <span className="text-gray-600 font-medium">오류 메시지</span>
                                        <span className="text-gray-900 font-semibold">{message}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/payments/create"
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
                            >
                                다시 시도
                            </Link>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200"
                            >
                                홈으로
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
