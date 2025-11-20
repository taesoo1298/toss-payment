import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="비밀번호 찾기" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">비밀번호 찾기</h2>
                <p className="mt-2 text-sm text-gray-600">
                    비밀번호를 잊으셨나요? 걱정하지 마세요.
                    이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{status}</span>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="이메일" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="example@email.com"
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    비밀번호 재설정 링크 보내기
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href={route('login')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    로그인 페이지로 돌아가기
                </Link>
            </div>
        </GuestLayout>
    );
}
