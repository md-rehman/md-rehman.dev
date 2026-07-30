import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/docs",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
