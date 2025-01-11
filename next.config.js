/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  output: 'export',
  productionBrowserSourceMaps: true,
  experimental: {
    reactCompiler: true,
  },
});

module.exports = nextConfig;
