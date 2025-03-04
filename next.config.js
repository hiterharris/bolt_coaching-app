/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow dynamic API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add environment variables that should be available at build time
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
  },
};

module.exports = nextConfig;