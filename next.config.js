/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for Docker optimization
  output: 'standalone',
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
  },
  
  // Image optimization
  images: {
    unoptimized: false,
    domains: [],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variables for Docker
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  
  // Webpack optimization for Docker builds
  webpack: (config, { dev }) => {
    // Optimization for production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
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
};

module.exports = nextConfig;