import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization for better performance
  output: 'standalone',
  
  // Compress images and optimize them
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Server external packages
  serverExternalPackages: ['sharp', 'pdfkit', 'mammoth'],
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*.(jpg|jpeg|png|gif|webp|avif|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/converter',
        destination: '/pdf-to-word',
        permanent: true,
      },
    ];
  },
  
  webpack: (config, { isServer }) => {
    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
    };

    // Handle Node.js modules that shouldn't be bundled on client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        'path-is-absolute': false,
      };
    }

    // Exclude modules from server-side bundling
    if (isServer) {
      config.externals = [
        ...config.externals,
        'canvas',
        'sharp',
        'pdfkit',
        'mammoth',
        'pdfjs-dist/legacy/build/pdf.worker.entry',
      ];
    }

    // Handle PDF.js worker for client-side
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]',
      },
    });

    // Optimize bundle size
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // PWA support (optional)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
};

export default nextConfig;
