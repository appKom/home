/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zerapolykbstrvqrqyqf.supabase.co",
      },
    ],
  },
};

export default nextConfig;
