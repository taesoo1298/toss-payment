import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="이메일 인증" />

            <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">이메일 인증</h2>
                <p className="mt-2 text-sm text-gray-600">
                    회원가입해 주셔서 감사합니다!
                </p>
            </div>

            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p>
                    서비스 이용을 위해 이메일 인증이 필요합니다.
                    방금 전송된 이메일의 인증 링크를 클릭해주세요.
                </p>
                <p className="mt-2">
                    이메일을 받지 못하셨다면 아래 버튼을 눌러 다시 보내실 수 있습니다.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>인증 이메일이 발송되었습니다. 메일함을 확인해주세요.</span>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    인증 이메일 다시 보내기
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-600 hover:text-gray-900"
                >
                    로그아웃
                </Link>
            </div>
        </GuestLayout>
    );
}
