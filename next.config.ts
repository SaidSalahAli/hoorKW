const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/system',
      '@mui/icons-material',
      '@wandersonalwes/iconsax-react',
      'framer-motion',
      'lodash'
    ]
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'api.elhoormoving.com',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**'
      }
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);