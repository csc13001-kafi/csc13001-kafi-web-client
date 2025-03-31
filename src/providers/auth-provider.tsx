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
  const { isAuthenticated, token, user, getUserInfo } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      console.log("Auth Provider initializing...");
      console.log("Initial auth state:", { 
        isAuthenticated, 
        hasToken: !!token, 
        hasUser: !!user 
      });
      
      // If we have a token but no user data or incomplete user data, try to fetch user info
      if (token && (!user || !user.name)) {
        console.log("Token exists but user data is missing or incomplete. Fetching user info...");
        try {
          await getUserInfo();
          console.log("User info fetched successfully");
        } catch (error) {
          console.error("Failed to fetch user info on init:", error);
        }
      }
      
      // Check if the current path requires authentication
      const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
      const isAuthPath = ['/login', '/signup', '/forgot-password', '/recovery-password'].includes(pathname);
      
      if (!isAuthenticated && isProtectedPath) {
        // If not authenticated and trying to access a protected path, redirect to login
        console.log("Not authenticated, redirecting from protected path to login");
        router.push('/login');
      } else if (isAuthenticated && isAuthPath) {
        // If already authenticated and trying to access auth pages, redirect to home
        console.log("Already authenticated, redirecting from auth path to home");
        router.push('/');
      }
      
      // Done checking, stop loading
      console.log("Auth initialization complete");
      setIsLoading(false);
    };

    initAuth();
  }, [isAuthenticated, pathname, router, token, user, getUserInfo]);

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