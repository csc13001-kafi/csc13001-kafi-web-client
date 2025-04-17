'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import groupcf from '../../../public/groupcf.png';
import logo from '../../../public/logo.png';
import bgImage from '../../../public/nen.png';
import { useAuthStore } from '@/stores/auth-store';

export default function SignupPage() {
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
        <Image src={logo} alt="Kafi Logo" width={400} height={400} />
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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { signup, isLoading, error: authError, clearError } = useAuthStore();
    const router = useRouter();

    // Clear any previous errors when the component mounts
    useEffect(() => {
        clearError();
        return () => {
            // Also clear errors when unmounting
            clearError();
        };
    }, [clearError]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await signup(name, email, phone, password);
            // Check if registration was successful
            const { error, isAuthenticated } = useAuthStore.getState();

            if (error) {
                setError(error);
            } else if (isAuthenticated) {
                // Logout the user after successful signup
                const { logout } = useAuthStore.getState();
                logout();

                setSuccess(true);

                router.push('/login');
            }
        } catch {
            setError('An error occurred during registration');
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
            onSubmit={handleSignup}
            className="flex w-1/2 flex-col items-center justify-center space-y-2"
        >
            <h1 className="mb-6 text-4xl font-bold">Đăng Ký</h1>

            {(error || authError) && (
                <div className="mb-2 w-4/6 text-sm text-red-500">
                    {error || authError}
                </div>
            )}

            {success && (
                <div className="mb-2 w-4/6 text-sm text-green-600">
                    Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
                </div>
            )}

            {!success && (
                <>
                    <InputField
                        label="Họ và tên"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputField
                        label="Số điện thoại"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <InputField
                        label="Mật khẩu"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputField
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="h-2"></div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-[#1E4522] to-[#3A683D] px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
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

                    <div className="h-2"></div>

                    <LoginPrompt onNavigate={handleNavigation} />
                </>
            )}
        </form>
    );
};

const LoginPrompt = ({ onNavigate }: { onNavigate: () => void }) => (
    <p className="text-sm">
        Đã có tài khoản?{' '}
        <Link
            href="/login"
            onClick={onNavigate}
            className="font-semibold text-green-600"
        >
            Đăng Nhập
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
