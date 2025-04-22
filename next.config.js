/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: [
            'kafi-storage.sgp1.cdn.digitaloceanspaces.com',
            'kafi-storage.sgp1.digitaloceanspaces.com',
        ],
    },
};

export default nextConfig;
