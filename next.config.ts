import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://vercel.live https://analytics.vercel.com https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://apis.google.com https://*.firebaseio.com 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://img.youtube.com https://i.ytimg.com https://www.google.com/images/;
  font-src 'self' https://fonts.gstatic.com;
  media-src 'self' https://storage.googleapis.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.vercel.com https://www.gstatic.com https://firebase.googleapis.com https://content-firebaseappcheck.googleapis.com https://securetoken.googleapis.com https://www.google.com/recaptcha/ https://firestore.googleapis.com https://identitytoolkit.googleapis.com wss://*.firebaseio.com https://us-central1-two-ais.cloudfunctions.net https://firebaseinstallations.googleapis.com;
  frame-src 'self' https://www.youtube.com https://www.google.com/recaptcha/ https://two-ais.firebaseapp.com https://*.firebaseio.com https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Add COOP header for origin isolation
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
  // ... you can add other security headers here ...
];

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
