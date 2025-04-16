'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
    children: React.ReactNode;
}

// Pages that require authentication
const protectedPaths = [
    '/edit-profile',
    // '/membership', // Removed to allow access without authentication
    // Add other protected paths here
];

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, token, user, getUserInfo } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const initRef = useRef(false);

    // This effect only runs once on mount to fetch user data
    useEffect(() => {
        const initializeAuth = async () => {
            if (initRef.current) return;
            initRef.current = true;

            console.log('Auth Provider initializing...');

            // If we have a token but no user data, try to fetch it only once
            if (token && !user) {
                try {
                    await getUserInfo();
                } catch (error) {
                    console.error('Failed to fetch user info on init:', error);
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, [token, user, getUserInfo]);

    // This effect handles navigation/routing based on auth state
    // It doesn't trigger user info fetching
    useEffect(() => {
        if (isLoading) return;

        // Check if the current path requires authentication
        const isProtectedPath = protectedPaths.some((path) =>
            pathname.startsWith(path),
        );
        const isAuthPath = [
            '/login',
            '/signup',
            '/forgot-password',
            '/recovery-password',
        ].includes(pathname);

        if (!isAuthenticated && isProtectedPath) {
            // If not authenticated and trying to access a protected path, redirect to login
            router.push('/login');
        } else if (isAuthenticated && isAuthPath) {
            // If already authenticated and trying to access auth pages, redirect to home
            router.push('/');
        }
    }, [isAuthenticated, pathname, router, isLoading]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700"></div>
            </div>
        );
    }

    // Render children
    return <>{children}</>;
}
