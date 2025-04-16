'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import logo from '../../../public/logo.png';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

export function Header() {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between px-40 py-8">
            <div className="flex items-center">
                <Image
                    src={logo}
                    onClick={() => router.push('/')}
                    alt="Kafi Logo"
                    width={120}
                    height={120}
                />
            </div>
            <div className="flex items-center gap-8">
                <Navigation />
                <Account />
            </div>
        </div>
    );
}

function Navigation() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Menu' },
        { path: '/membership', label: 'Chương trình thành viên' },
        { path: '/feedback', label: 'Gửi feedback' },
    ];

    return (
        <div className="flex select-none gap-8">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`select-none transition ${
                        pathname === item.path
                            ? 'font-medium text-green-600'
                            : ''
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

function Account() {
    const { isAuthenticated, logout, user, getUserInfo } = useAuthStore();
    const [displayName, setDisplayName] = useState<string>('User');
    const [initial, setInitial] = useState<string>('U');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    // Run once on component mount to fetch user data if needed
    useEffect(() => {
        const fetchUserData = async () => {
            // If authenticated and we don't have complete user data
            if (isAuthenticated) {
                if (!user || !user.username) {
                    console.log('Fetching user data for header');
                    await getUserInfo();
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, user, getUserInfo]);

    // This effect updates the displayed name whenever user data changes
    useEffect(() => {
        if (user) {
            console.log('User data in header:', user);
            // Prioritize username as the primary display name
            if (user.username) {
                setDisplayName(user.username);
                setInitial((user.username[0] || 'U').toUpperCase());
            }
            // Fall back to name if username is not available
            else if (user.name) {
                setDisplayName(user.name);
                setInitial((user.name[0] || 'U').toUpperCase());
            }
            // Last resort: email (without showing full email)
            else if (user.email) {
                // Just use the first part of the email
                const emailPrefix = user.email.split('@')[0];
                setDisplayName(emailPrefix);
                setInitial((emailPrefix[0] || 'U').toUpperCase());
            }
        } else {
            setDisplayName('User');
            setInitial('U');
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            // Show loading state
            setIsLoggingOut(true);

            // Call the async logout function
            await logout();

            // Redirect to login page after successful logout
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
            // Still redirect to login page even if there's an error
            router.push('/login');
        } finally {
            // Clear loading state
            setIsLoggingOut(false);
        }
    };

    if (isAuthenticated) {
        return (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-2 transition hover:opacity-80">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
                            {initial}
                        </div>
                        <span className="font-medium">{displayName}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] rounded-md border border-gray-200 bg-white p-2 shadow-lg"
                        sideOffset={5}
                        align="end"
                    >
                        <DropdownMenu.Item
                            className="flex cursor-pointer items-center rounded-md px-4 py-2 text-sm outline-none hover:bg-gray-100"
                            onClick={() => router.push('/edit-profile')}
                        >
                            Chỉnh sửa thông tin
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="flex cursor-pointer items-center rounded-md px-4 py-2 text-sm text-red-600 outline-none hover:bg-gray-100"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <span className="mr-2 animate-spin">⟳</span>
                                    Đang đăng xuất...
                                </>
                            ) : (
                                'Đăng xuất'
                            )}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        );
    }

    return (
        <div className="flex gap-6">
            <Button
                onClick={() => router.push('/signup')}
                className="w-max select-none rounded-full px-10"
            >
                Đăng ký
            </Button>
            <Button
                onClick={() => router.push('/login')}
                className="w-max select-none rounded-full border border-black bg-white px-10 text-black hover:bg-gray-100"
            >
                Đăng nhập
            </Button>
        </div>
    );
}
