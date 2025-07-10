import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
  },
};

module.exports = withBundleAnalyzer(nextConfig);
