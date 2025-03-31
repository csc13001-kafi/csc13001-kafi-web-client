'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Pages that require authentication
const protectedPaths = [
  '/edit-profile',
  // Add other protected paths here
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the current path requires authentication
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPath = ['/login', '/signup', '/forgot-password', '/recovery-password'].includes(pathname);
    
    if (!isAuthenticated && isProtectedPath) {
      // If not authenticated and trying to access a protected path, redirect to login
      router.push('/login');
    } else if (isAuthenticated && isAuthPath) {
      // If already authenticated and trying to access auth pages, redirect to home
      router.push('/');
    }
    
    // Done checking, stop loading
    setIsLoading(false);
  }, [isAuthenticated, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Render children
  return <>{children}</>;
} 