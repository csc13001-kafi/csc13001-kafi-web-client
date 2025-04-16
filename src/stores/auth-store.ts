import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import api from '@/lib/api';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    username?: string;
    loyaltyPoints?: number;
    loyalty?: string;
}

interface AuthResponse {
    user: User;
    token: string;
    accessToken?: string;
    userData?: User;
}

interface ApiErrorResponse {
    message: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    lastUserFetch: number | null;
    isUserInfoFetching: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (
        name: string,
        email: string,
        phone: string,
        password: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    requestPasswordRecovery: (email: string) => Promise<void>;
    resetPassword: (
        email: string,
        otp: string,
        newPassword: string,
        confirmPassword: string,
    ) => Promise<void>;
    getUserInfo: () => Promise<void>;
    clearError: () => void;
}

// Cache TTL in milliseconds - 5 minutes
const USER_CACHE_TTL = 5 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastUserFetch: null,
            isUserInfoFetching: false,

            clearError: () => {
                set({ error: null });
            },

            getUserInfo: async () => {
                const { token, user, lastUserFetch, isUserInfoFetching } =
                    get();

                if (!token) return;

                if (isUserInfoFetching) {
                    console.log(
                        'User info fetch already in progress, skipping duplicate request',
                    );
                    return;
                }

                const now = Date.now();
                const isCacheValid =
                    lastUserFetch && now - lastUserFetch < USER_CACHE_TTL;

                if (user && isCacheValid) {
                    console.log('Using cached user data');
                    return;
                }

                try {
                    set({ isUserInfoFetching: true });
                    console.log(
                        'Fetching user info (cache expired or not available)',
                    );

                    const response = await api.get<User>(`/users/user`);
                    const userData = response.data;

                    if (userData) {
                        set({
                            user: userData,
                            lastUserFetch: Date.now(),
                            isUserInfoFetching: false,
                        });
                        console.log('User data fetched and cached');
                    } else {
                        console.error('Failed to retrieve user data');
                        set({ isUserInfoFetching: false });
                    }
                } catch (err) {
                    console.error('Error fetching user info:', err);
                    set({ isUserInfoFetching: false });

                    if (
                        axios.isAxiosError(err) &&
                        err.response?.status === 401
                    ) {
                        get().logout();
                    }
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    console.log('Logging in with:', { email, password: '***' });

                    // Some APIs expect username instead of email
                    const username = email;

                    const response = await api.post<AuthResponse>(
                        '/auth/sign-in',
                        {
                            username,
                            password,
                        },
                    );

                    console.log('Login response:', response.data);

                    // Extract token and user data from the response
                    // Handle different API response structures
                    const responseToken =
                        response.data.token || response.data.accessToken;
                    let responseUser =
                        response.data.user || response.data.userData;

                    // If the user object is not in the expected format, try to construct it
                    if (!responseUser && responseToken) {
                        responseUser = {
                            id: 'temp-id',
                            name: email.split('@')[0], // Use part before @ as display name
                            email: email,
                        };
                        console.log(
                            'Created fallback user object:',
                            responseUser,
                        );
                    }

                    console.log('Extracted token:', responseToken);
                    console.log('Extracted user:', responseUser);

                    if (responseToken) {
                        set({
                            isLoading: false,
                            isAuthenticated: true,
                            user: responseUser,
                            token: responseToken,
                        });

                        // If we don't have enough user info, try to fetch it
                        if (
                            (!responseUser || !responseUser.name) &&
                            responseToken
                        ) {
                            console.log(
                                'User info incomplete, fetching more details...',
                            );
                            await get().getUserInfo();
                        }
                    } else {
                        throw new Error('No token received from server');
                    }
                } catch (err) {
                    console.error('Login error:', err);
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<ApiErrorResponse>;
                        set({
                            isLoading: false,
                            error:
                                axiosError.response?.data?.message ||
                                'Invalid email or password',
                        });
                    } else {
                        set({ isLoading: false, error: 'Failed to login' });
                    }
                }
            },

            signup: async (name, email, phone, password) => {
                set({ isLoading: true, error: null });
                try {
                    const username = name;
                    const response = await api.post<AuthResponse>(
                        '/auth/sign-up',
                        {
                            username,
                            email,
                            phone,
                            password,
                        },
                    );

                    const { user, token } = response.data;

                    set({
                        isLoading: false,
                        isAuthenticated: true,
                        user,
                        token,
                    });

                    if (!user && token) {
                        await get().getUserInfo();
                    }
                } catch (err) {
                    console.error('Signup error:', err);
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<ApiErrorResponse>;
                        set({
                            isLoading: false,
                            error:
                                axiosError.response?.data?.message ||
                                'Failed to register',
                        });
                    } else {
                        set({ isLoading: false, error: 'Failed to register' });
                    }
                }
            },

            logout: async () => {
                try {
                    const { token } = get();
                    // Only make the API call if we have a token
                    if (token) {
                        console.log('Calling sign-out API');
                        try {
                            // Call the sign-out API endpoint
                            await api.delete('/auth/sign-out');
                            console.log('Successfully signed out from API');
                        } catch (err) {
                            // Even if the API call fails, we still want to log out locally
                            console.error('Error calling sign-out API:', err);
                        }
                    }
                } finally {
                    // Always clear the local state regardless of API response
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null,
                    });
                    console.log('Logged out locally');
                }
            },

            forgotPassword: async (email) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post('/auth/forgot-password', { email });
                    set({ isLoading: false });
                } catch (err) {
                    console.error('Forgot password error:', err);
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<ApiErrorResponse>;
                        set({
                            isLoading: false,
                            error:
                                axiosError.response?.data?.message ||
                                'Failed to process request',
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: 'Failed to process request',
                        });
                    }
                }
            },

            requestPasswordRecovery: async (email) => {
                set({ isLoading: true, error: null });
                try {
                    console.log('Requesting password recovery OTP for:', email);
                    await api.post('/auth/password-recovery', { email });
                    console.log('OTP request successful');
                    set({ isLoading: false });
                } catch (err) {
                    console.error('Password recovery error:', err);
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<ApiErrorResponse>;
                        set({
                            isLoading: false,
                            error:
                                axiosError.response?.data?.message ||
                                'Failed to send OTP',
                        });
                    } else {
                        set({ isLoading: false, error: 'Failed to send OTP' });
                    }
                }
            },

            resetPassword: async (email, otp, newPassword, confirmPassword) => {
                set({ isLoading: true, error: null });
                try {
                    console.log('Resetting password with OTP');
                    await api.post('/auth/reset-password', {
                        email,
                        otp,
                        newPassword,
                        confirmPassword,
                    });
                    console.log('Password reset successful');
                    set({ isLoading: false });
                } catch (err) {
                    console.error('Reset password error:', err);
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<ApiErrorResponse>;
                        set({
                            isLoading: false,
                            error:
                                axiosError.response?.data?.message ||
                                'Failed to reset password',
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: 'Failed to reset password',
                        });
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
        },
    ),
);
