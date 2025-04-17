'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import groupcf from '../../../public/groupcf.png';
import bgImage from '../../../public/nen.png';
import { useAuthStore } from '@/stores/auth-store';

export default function RecoveryPasswordPage() {
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
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {
        resetPassword,
        isLoading,
        error: authError,
        clearError,
    } = useAuthStore();
    const router = useRouter();

    // Clear any previous errors when the component mounts
    useEffect(() => {
        clearError();
        return () => {
            // Also clear errors when unmounting
            clearError();
        };
    }, [clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError('Vui lòng nhập mã xác nhận từ email');
            return;
        }

        if (!newPassword) {
            setError('Vui lòng nhập mật khẩu mới');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            await resetPassword(
                token,
                newPassword,
                'password_recovery',
                'password_recovery',
            );
            setSuccess(true);

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                clearError(); // Clear errors before redirecting
                router.push('/login');
            }, 3000);
        } catch {
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
            onSubmit={handleSubmit}
            className="flex w-1/2 flex-col items-center justify-center space-y-4"
        >
            <h1 className="mb-6 text-4xl font-bold">Đặt Lại Mật Khẩu</h1>

            {(error || authError) && (
                <div className="mb-2 w-4/6 text-sm text-red-500">
                    {error || authError}
                </div>
            )}

            {success ? (
                <div className="w-4/6 space-y-4">
                    <div className="mb-2 text-sm text-green-600">
                        Mật khẩu đã được đặt lại thành công. Bạn sẽ được chuyển
                        đến trang đăng nhập...
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-4 w-4/6 text-sm">
                        Nhập mã xác nhận đã được gửi đến email của bạn và mật
                        khẩu mới.
                    </div>

                    <InputField
                        label="Mã xác nhận"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />

                    <InputField
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <InputField
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-[#1E4522] to-[#3A683D] px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
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

                    <BackToLoginLink onNavigate={handleNavigation} />
                </>
            )}
        </form>
    );
};

const BackToLoginLink = ({ onNavigate }: { onNavigate: () => void }) => (
    <p className="mt-6 text-sm">
        <Link
            href="/login"
            onClick={onNavigate}
            className="font-semibold text-green-600"
        >
            Quay lại đăng nhập
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
