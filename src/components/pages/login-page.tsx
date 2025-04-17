'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import groupcf from '../../../public/groupcf.png';
import bgImage from '../../../public/nen.png';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="relative flex h-screen w-screen overflow-hidden">
            <BackgroundImage />
            <LeftSection />
            <RightSection />
        </div>
    );
}

const BackgroundImage = () => (
    <Image
        src={bgImage}
        alt="Background"
        fill
        className="fixed inset-0 -z-10 h-full w-full object-cover"
        priority
    />
);

const LeftSection = () => (
    <div className="relative flex w-1/2 flex-col items-center justify-center">
        <Logo />
        <CoffeeSelectionImage />
    </div>
);

const Logo = () => (
    <div className="absolute left-36 top-8 flex items-center space-x-2">
        <Image
            src="https://kafi-storage.sgp1.cdn.digitaloceanspaces.com/client/logo.png"
            alt="Kafi Logo"
            width={400}
            height={400}
        />
    </div>
);

const CoffeeSelectionImage = () => (
    <div className="-ml-32 mt-96">
        <Image
            src={groupcf}
            alt="Coffee Selection"
            width={950}
            height={950}
            className="object-cover"
        />
    </div>
);

const RightSection = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading, error: authError, clearError } = useAuthStore();
    const router = useRouter();

    // Clear any previous errors when the component mounts
    useEffect(() => {
        clearError();
        return () => {
            // Also clear errors when unmounting
            clearError();
        };
    }, [clearError]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            await login(email, password);
            // Check for auth error after login attempt
            const { error, isAuthenticated } = useAuthStore.getState();

            if (error) {
                setError(error);
            } else if (isAuthenticated) {
                router.push('/'); // Redirect to home page instead of dashboard
            }
        } catch {
            setError('An error occurred during login');
        }
    };

    // Clear errors when navigating away using the Link component
    const handleNavigation = () => {
        // Clear both local and store errors
        setError(null);
        clearError();
    };

    return (
        <form
            onSubmit={handleLogin}
            className="flex w-1/2 flex-col items-center justify-center space-y-4"
        >
            <h1 className="mb-6 text-4xl font-bold">Đăng Nhập</h1>

            {(error || authError) && (
                <div className="mb-2 w-4/6 text-sm text-red-500">
                    {error || authError}
                </div>
            )}

            <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <ForgotPasswordLink onNavigate={handleNavigation} />

            <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-[#1E4522] to-[#3A683D] px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
            >
                {isLoading ? 'Đang xử lý...' : 'Bắt đầu'}
                {!isLoading && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 18l6-6-6-6"></path>
                    </svg>
                )}
            </button>

            <SignUpPrompt onNavigate={handleNavigation} />
        </form>
    );
};

const ForgotPasswordLink = ({ onNavigate }: { onNavigate: () => void }) => (
    <div className="w-4/6 text-right text-sm text-gray-600 hover:text-gray-800">
        <Link href="/password-recovery" onClick={onNavigate}>
            Quên mật khẩu?
        </Link>
    </div>
);

const SignUpPrompt = ({ onNavigate }: { onNavigate: () => void }) => (
    <p className="mt-6 text-sm">
        Chưa có tài khoản?{' '}
        <Link
            href="/signup"
            onClick={onNavigate}
            className="font-semibold text-green-600"
        >
            Đăng Ký
        </Link>
    </p>
);

interface InputFieldProps {
    label: string;
    placeholder?: string;
    textarea?: boolean;
    type?: string;
    value?: string;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
}

const InputField = ({
    label,
    placeholder,
    textarea,
    type,
    value,
    onChange,
}: InputFieldProps) => (
    <div className="w-4/6">
        <label className="mb-1 block font-medium">{label}</label>
        {textarea ? (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-full border border-black bg-transparent p-3 text-black placeholder:text-gray-500 focus:outline-none"
                rows={4}
            ></textarea>
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-full border border-black bg-transparent p-3 text-black placeholder:text-gray-500 focus:outline-none"
            />
        )}
    </div>
);
