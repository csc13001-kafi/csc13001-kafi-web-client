import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll simulate a successful login
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Validate credentials (this is a mock)
          if (email === 'user@example.com' && password === 'password') {
            const user = {
              id: '1',
              name: 'Test User',
              email: 'user@example.com',
              phone: '0123456789'
            };
            
            set({
              isLoading: false,
              isAuthenticated: true,
              user,
              token: 'mock-jwt-token',
            });
          } else {
            set({ isLoading: false, error: 'Invalid email or password' });
          }
        } catch {
          set({ isLoading: false, error: 'Failed to login' });
        }
      },

      signup: async (name, email, phone, password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Simulate successful registration
          const user = {
            id: '2',
            name,
            email,
            phone,
          };
          
          set({
            isLoading: false,
            isAuthenticated: true,
            user,
            token: 'mock-jwt-token',
          });
        } catch {
          set({ isLoading: false, error: 'Failed to register' });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For demo, we'll just simulate a successful API call
          console.log(`Password reset requested for: ${email}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch {
          set({ isLoading: false, error: 'Failed to process request' });
        }
      },

      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For demo, we'll just simulate a successful API call
          console.log(`Resetting password with token: ${token}, new password length: ${newPassword.length}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch {
          set({ isLoading: false, error: 'Failed to reset password' });
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage
    }
  )
); 