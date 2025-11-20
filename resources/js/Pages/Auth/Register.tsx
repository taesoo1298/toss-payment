import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SocialLoginButton from '@/Components/SocialLoginButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="회원가입" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Dr.Smile에 오신 것을 환영합니다
                </p>
            </div>

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
                    <span className="bg-white px-4 text-gray-500">또는 이메일로 가입</span>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="이름" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="홍길동"
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="이메일" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="example@email.com"
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="8자 이상 입력해주세요"
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="비밀번호 확인"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="비밀번호를 다시 입력해주세요"
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    회원가입
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link
                    href={route('login')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    로그인
                </Link>
            </p>
        </GuestLayout>
    );
}
