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
};

export default nextConfig;
