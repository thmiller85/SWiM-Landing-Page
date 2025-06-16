/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['drizzle-orm', '@neondatabase/serverless'],
  },
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
    unoptimized: true
  },
  async rewrites() {
    return [
      // API routes are handled by Next.js directly
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      }
    ]
  }
}

module.exports = nextConfig