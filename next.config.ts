import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://vercel.live https://analytics.vercel.com https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://apis.google.com https://*.firebaseio.com 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://img.youtube.com https://i.ytimg.com https://www.google.com/images/ https://storage.googleapis.com https://*.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  media-src 'self' https://storage.googleapis.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.vercel.com https://www.gstatic.com https://firebase.googleapis.com https://content-firebaseappcheck.googleapis.com https://securetoken.googleapis.com https://www.google.com/recaptcha/ https://firestore.googleapis.com https://identitytoolkit.googleapis.com wss://*.firebaseio.com https://us-central1-two-ais.cloudfunctions.net https://firebaseinstallations.googleapis.com;
  frame-src 'self' https://www.youtube.com https://www.google.com/recaptcha/ https://two-ais.firebaseapp.com https://*.firebaseio.com https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
`;

// HSTS Configuration - Staged rollout approach for active production deployment
const getHSTSHeader = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercelProduction = process.env.VERCEL_ENV === 'production';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';
  
  // Stage 1: Development (localhost) - No HSTS
  if (!isProduction) {
    console.log('HSTS: Development mode - No HSTS header (allows HTTP for local development)');
    return null;
  }
  
  // Stage 2: Vercel Preview/Staging - Short max-age, includeSubDomains, no preload
  if (isProduction && isVercelPreview) {
    console.log('HSTS: Preview/Staging mode - Short max-age with includeSubDomains (no preload)');
    return {
      key: 'Strict-Transport-Security',
      value: 'max-age=3600; includeSubDomains', // 1 hour
    };
  }
  
  // Stage 3: Vercel Production - Very conservative HSTS for multiple daily deployments
  if (isProduction && isVercelProduction) {
    console.log('HSTS: Production mode - Very conservative HSTS (safe for multiple daily deployments)');
    return {
      key: 'Strict-Transport-Security',
      value: 'max-age=3600; includeSubDomains', // 1 hour - very safe for rapid development
    };
  }
  
  // Fallback for other production environments
  if (isProduction) {
    console.log('HSTS: Production mode (non-Vercel) - Moderate HSTS without preload');
    return {
      key: 'Strict-Transport-Security',
      value: 'max-age=604800; includeSubDomains', // 1 week
    };
  }
  
  return null;
};

const securityHeaders = [
  // CSP is handled in middleware.ts with nonces for better security
  // {
  //   key: 'Content-Security-Policy',
  //   value: ContentSecurityPolicy.replace(/\n/g, ''),
  // },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Add COOP header for origin isolation
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
  // HSTS Policy - Conditionally added based on environment
  ...(getHSTSHeader() ? [getHSTSHeader()!] : []),
  // Additional security headers
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  // Disable trailing slashes in URLs
  trailingSlash: false,
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
      {
        protocol: 'https',
        hostname: 'imgen.x.ai',
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
        // This will match all paths EXCEPT /__/auth/handler
        source: '/((?!__/auth/handler).*)',
        headers: securityHeaders, // Your original security headers including COOP
      },
      {
        // This will ONLY match /__/auth/handler and will NOT have the COOP header
        source: '/__/auth/handler',
        headers: [
          // You can include other, non-COOP headers here if you wish
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
