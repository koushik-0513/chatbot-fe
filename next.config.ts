import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.prodgain.ai",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Enable iframe embedding
  async headers() {
    return [
      {
        source: '/iframe',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *",
          },
        ],
      },
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Enable static file serving for embed files
  async rewrites() {
    return [
      {
        source: '/embed/:path*',
        destination: '/api/embed/:path*',
      },
    ];
  },
};

export default nextConfig;
