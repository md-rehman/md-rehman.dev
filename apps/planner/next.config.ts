import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/planner",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/planner",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
