import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // Cho phép ảnh từ domain ngoài nếu cần
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
