import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/companion",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/companion",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
