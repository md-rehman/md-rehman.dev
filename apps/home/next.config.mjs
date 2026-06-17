/** @type {import('next').NextConfig} */

/**
 * Sub-apps in the monorepo that the home app proxies to.
 * Each entry maps a URL prefix to the local dev server port.
 *
 * To add a new sub-app:
 *   1. Add an entry here with { name, port }
 *   2. Set `basePath: "/<name>"` in the sub-app's next.config.mjs
 *   3. (Production) Add a rewrite in vercel.json
 */
const subApps = [
  { name: "tv-set", port: 3011 },
  { name: "docs", port: 4001 },
  { name: "p5-playground", port: 3005 },
  { name: "companion", port: 3012 },
];

const nextConfig = {
  appName: "home",

  async rewrites() {
    return {
      // "beforeFiles" rewrites are checked before pages/public files,
      // so sub-app routes take priority over any home app catch-all pages.
      beforeFiles: subApps.flatMap(({ name, port }) => [
        {
          source: `/${name}`,
          destination: `http://localhost:${port}/${name}`,
        },
        {
          source: `/${name}/:path*`,
          destination: `http://localhost:${port}/${name}/:path*`,
        },
      ]),
    };
  },
};

export default nextConfig;
