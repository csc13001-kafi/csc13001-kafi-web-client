import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: ['kafi-storage.sgp1.cdn.digitaloceanspaces.com'],
    },
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
