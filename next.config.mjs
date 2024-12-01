/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["zerapolykbstrvqrqyqf.supabase.co"],
  },
  experimental: {
    cacheLife: {
      revalidate: 600,
    },
  },
};

export default nextConfig;
