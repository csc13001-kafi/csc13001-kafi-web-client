import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CounterStoreProvider } from '@/providers/counter-store-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Kafi - Coffee Shop',
    description: 'Kafi coffee shop website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased`}>
                <Toaster position="top-center" />
                <AuthProvider>
                    <CounterStoreProvider>{children}</CounterStoreProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
