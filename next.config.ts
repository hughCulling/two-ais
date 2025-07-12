import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Configure compiler options for modern browsers
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    // Optimize for modern browsers
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Configure webpack to target modern browsers
  webpack: (config, { dev, isServer }) => {
    // Only apply optimizations in production
    if (!dev && !isServer) {
      // Target modern browsers to reduce polyfills
      config.target = ['web', 'es2020'];
      
      // Disable polyfills for modern features
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Disable polyfills for features that are natively supported in modern browsers
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
      
      // Configure module rules to avoid unnecessary polyfills
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
