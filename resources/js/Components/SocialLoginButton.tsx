import { ButtonHTMLAttributes } from 'react';

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    provider: 'google' | 'kakao' | 'naver';
}

const providerConfig = {
    google: {
        name: 'Google',
        bg: 'bg-white hover:bg-gray-50',
        text: 'text-gray-700',
        border: 'border border-gray-300',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
        ),
    },
    kakao: {
        name: 'Kakao',
        bg: 'bg-[#FEE500] hover:bg-[#FDD835]',
        text: 'text-[#000000] text-opacity-85',
        border: '',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.842 1.89 5.34 4.707 6.738-.197.682-.643 2.228-.734 2.582-.11.428.157.422.334.307.138-.09 2.27-1.526 3.233-2.176.49.068.99.105 1.5.105 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
            </svg>
        ),
    },
    naver: {
        name: 'Naver',
        bg: 'bg-[#03C75A] hover:bg-[#02B350]',
        text: 'text-white',
        border: '',
        icon: (
            <svg className="w-5 h-5 font-bold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
            </svg>
        ),
    },
};

export default function SocialLoginButton({ provider, className = '', ...props }: SocialLoginButtonProps) {
    const config = providerConfig[provider];

    const handleClick = () => {
        window.location.href = route('social.redirect', { provider });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`
                w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg
                ${config.bg} ${config.text} ${config.border}
                transition-colors duration-200
                font-medium
                ${className}
            `}
            {...props}
        >
            {config.icon}
            <span>{config.name}로 계속하기</span>
        </button>
    );
}
