/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/tv-set",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tv-set/0",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
