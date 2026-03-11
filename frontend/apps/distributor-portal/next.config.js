/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'residentcement.com'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
    KEYCLOAK_URL: process.env.KEYCLOAK_URL || 'http://localhost:8180',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
