import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://kind-humpback-32.clerk.accounts.dev https://clerk.piyushydv.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://img.clerk.com https://images.unsplash.com; connect-src 'self' https://kind-humpback-32.clerk.accounts.dev https://clerk.piyushydv.com wss://*.liveblocks.io https://*.liveblocks.io https://moonlit-woodpecker-734.convex.cloud wss://moonlit-woodpecker-734.convex.cloud wss://*.convex.cloud https://*.convex.cloud; frame-src 'self' https://kind-humpback-32.clerk.accounts.dev https://clerk.piyushydv.com; upgrade-insecure-requests;",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
