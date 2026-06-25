/** @type {import('next').NextConfig} */

/**
 * Sub-apps in the monorepo that the home app proxies to.
 * Each entry maps a URL prefix to the local dev server port and production domain.
 */
const subApps = [
  { name: "tv-set", port: 3011, domain: "md-rehman-dev-tv-set.vercel.app" },
  { name: "docs", port: 4001, domain: "md-rehman-dev-docs.vercel.app" },
  { name: "companion", port: 3012, domain: "md-rehman-dev-companion.vercel.app" },
  { name: "planner", port: 3013, domain: "md-rehman-dev-planner.vercel.app" },
];

const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  async rewrites() {
    return {
      // "beforeFiles" rewrites are checked before pages/public files,
      // so sub-app routes take priority over any home app catch-all pages.
      beforeFiles: subApps.flatMap(({ name, port, domain }) => {
        const baseUrl = isDev ? `http://localhost:${port}` : `https://${domain}`;
        return [
          {
            source: `/${name}`,
            destination: `${baseUrl}/${name}`,
          },
          {
            source: `/${name}/:path*`,
            destination: `${baseUrl}/${name}/:path*`,
          },
        ];
      }),
    };
  },
};

export default nextConfig;
