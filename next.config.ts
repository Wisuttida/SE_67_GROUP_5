import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows all hostnames
        port: '', // No specific port
      },
      {
        protocol: 'http',
        hostname: '**', // This allows all hostnames
        port: '', // No specific port
      },
    ],
  },
};

export default nextConfig;
