import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.0.0.21',
        port: '5100',
        pathname: '/images/**',
      },
    ],
  },
};