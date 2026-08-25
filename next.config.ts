import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.e2b.app'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
