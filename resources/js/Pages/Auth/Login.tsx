import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SocialLoginButton from '@/Components/SocialLoginButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="로그인" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Dr.Smile 계정으로 로그인하세요
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {(errors as any).social && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                    {(errors as any).social}
                </div>
            )}

            <div className="space-y-3">
                <SocialLoginButton provider="google" />
                <SocialLoginButton provider="kakao" />
                <SocialLoginButton provider="naver" />
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">또는 이메일로 계속</span>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="이메일" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="example@email.com"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="비밀번호" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            로그인 상태 유지
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            비밀번호 찾기
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    로그인
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link
                    href={route('register')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    회원가입
                </Link>
            </p>
        </GuestLayout>
    );
}
