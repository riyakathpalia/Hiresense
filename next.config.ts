/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Increase the body size limit to 100 MB
    },
  },
  output:'standalone',
};

module.exports = nextConfig;
