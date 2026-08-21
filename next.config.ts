import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: true, // Uses a 308 permanent redirect
      },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
