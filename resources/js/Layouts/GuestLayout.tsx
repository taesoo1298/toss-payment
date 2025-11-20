import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-2">
                <Link href="/" className="transition-transform hover:scale-105">
                    <ApplicationLogo className="h-20 w-20 fill-current text-indigo-600" />
                </Link>
            </div>

            <div className="w-full overflow-hidden bg-white px-8 py-8 shadow-lg sm:max-w-md sm:rounded-xl">
                {children}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                <p>© 2024 Dr.Smile. All rights reserved.</p>
            </div>
        </div>
    );
}
