/** @type {import('next').NextConfig} */
const nextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // ✅ must be true for static export (Next can't optimize images statically)
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  reactStrictMode: true,
};

export default nextConfig;
