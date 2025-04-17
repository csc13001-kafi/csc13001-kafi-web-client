'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function EditProfile() {
    // States for password change section
    const router = useRouter();
    const { logout, user, getUserInfo } = useAuthStore();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<{
        [key: string]: string;
    }>({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // States for profile update section
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('N/A');
    const [profileErrors, setProfileErrors] = useState<{
        [key: string]: string;
    }>({});
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/users/user');
                const userData = response.data;

                // Set form values from fetched data
                setUsername(userData.username || '');
                setEmail(userData.email || '');
                setPhone(userData.phone || '');
                setAddress(userData.address || 'N/A'); // Use N/A as default if no address
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Không thể tải thông tin người dùng');

                // Fallback to store data if API fetch fails
                if (user) {
                    setUsername(user.username || '');
                    setEmail(user.email || '');
                    setPhone(user.phone || '');
                    setAddress('N/A');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    // Profile validation function
    const validateProfile = () => {
        const errors: { [key: string]: string } = {};

        if (!username) {
            errors.username = 'Vui lòng nhập tên người dùng';
        }

        if (!email) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (phone && !/^\d{10,11}$/.test(phone)) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!address) {
            errors.address = 'Vui lòng nhập địa chỉ hoặc để N/A';
        }

        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle profile update submission
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateProfile()) {
            return;
        }

        try {
            setIsUpdatingProfile(true);

            // Call the API endpoint to update profile
            await api.patch('/users/user', {
                username,
                email,
                phone,
                address,
            });

            // Update user info in store
            await getUserInfo();

            // Show success message
            toast.success('Thông tin cá nhân đã được cập nhật thành công');
        } catch (error: unknown) {
            console.error('Error updating profile:', error);

            // Handle specific API error messages
            const errorResponse = error as {
                response?: { data?: { message?: string } };
            };
            const errorMessage =
                errorResponse.response?.data?.message ||
                'Không thể cập nhật thông tin. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    // Password validation function
    const validatePasswords = () => {
        const errors: { [key: string]: string } = {};

        if (!oldPassword) {
            errors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
        }

        if (!newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (confirmPassword !== newPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle password change submission
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        try {
            setIsChangingPassword(true);

            // Call the API endpoint
            await api.put('/auth/change-password', {
                oldPassword,
                newPassword,
                confirmPassword,
            });

            // Reset form on success
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Show success message
            toast.success('Mật khẩu đã được thay đổi thành công');

            // Clear authentication and navigate to login page
            toast.success('Vui lòng đăng nhập lại với mật khẩu mới');
            await logout();
            router.push('/login');
        } catch (error: unknown) {
            console.error('Error changing password:', error);

            // Handle specific API error messages
            const errorResponse = error as {
                response?: { data?: { message?: string } };
            };
            const errorMessage =
                errorResponse.response?.data?.message ||
                'Không thể thay đổi mật khẩu. Vui lòng thử lại.';
            toast.error(errorMessage);

            // If the error is related to old password being incorrect, set a specific error
            if (
                errorMessage.includes('incorrect') ||
                errorMessage.includes('wrong')
            ) {
                setPasswordErrors((prev) => ({
                    ...prev,
                    oldPassword: 'Mật khẩu cũ không chính xác',
                }));
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Show loading state while fetching user data
    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-100">
                <Header />
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <Header />
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="w-2/4 max-w-screen-lg space-y-16 rounded-2xl p-10">
                    <h1 className="mb-8 text-center text-5xl font-bold">
                        Chỉnh sửa thông tin
                    </h1>

                    <form
                        onSubmit={handleUpdateProfile}
                        className="rounded-2xl border-2 border-[#E4E4E4] bg-white p-6 shadow"
                    >
                        <h2 className="mb-4 text-2xl font-semibold">
                            Thông tin cơ bản
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                label="Tên người dùng"
                                placeholder="Nhập tên người dùng"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={profileErrors.username}
                            />
                            <InputField
                                label="Email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={profileErrors.email}
                            />
                            <InputField
                                label="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                error={profileErrors.phone}
                            />
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className={`w-full rounded-2xl px-4 py-3 font-medium text-white ${
                                        isUpdatingProfile
                                            ? 'cursor-not-allowed bg-gray-400'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {isUpdatingProfile
                                        ? 'Đang xử lý...'
                                        : 'Cập nhật thông tin'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <form
                        onSubmit={handleChangePassword}
                        className="mt-6 rounded-2xl border-2 border-[#E4E4E4] bg-white p-6 shadow"
                    >
                        <h2 className="mb-4 text-2xl font-semibold">
                            Cài đặt mật khẩu
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                label="Mật khẩu cũ"
                                placeholder="Nhập mật khẩu cũ"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                error={passwordErrors.oldPassword}
                            />
                            <InputField
                                label="Mật khẩu mới"
                                placeholder="Nhập mật khẩu mới"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={passwordErrors.newPassword}
                            />
                            <InputField
                                label="Nhập lại mật khẩu mới"
                                placeholder="Nhập lại mật khẩu mới"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                error={passwordErrors.confirmPassword}
                            />
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className={`w-full rounded-2xl px-4 py-3 font-medium text-white ${
                                        isChangingPassword
                                            ? 'cursor-not-allowed bg-gray-400'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {isChangingPassword
                                        ? 'Đang xử lý...'
                                        : 'Lưu thay đổi mật khẩu'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

function InputField({
    label,
    placeholder,
    type = 'text',
    value,
    onChange,
    error,
}: InputFieldProps) {
    return (
        <div>
            <label className="mb-1 block font-medium">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full rounded-2xl border bg-[#A4BBAA] p-3 text-black placeholder:text-black focus:outline-none ${
                    error ? 'border-red-500' : 'border-transparent'
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
