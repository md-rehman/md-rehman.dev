/** @type {import('next').NextConfig} */

import { enableModuleFederation, loadEnv } from "@repo/build-plugins";

loadEnv();
const REMOTES_URL = {
  production:
    "p5-playground@https://www.md-rehman.dev/p5-playground/_next/static/chunks/remoteEntry.js",
  development:
    "p5-playground@http://localhost:3005/p5-playground/_next/static/chunks/remoteEntry.js",
};

const nextConfig = {
  appName: "tv-set",
  env: {
    APP_P5_PLAYGROUND: process.env.APP_P5_PLAYGROUND,
  },
  remotes: {
    "p5-playground":
      REMOTES_URL[process.env.NODE_ENV] || REMOTES_URL.development,
  },
};

export default enableModuleFederation(nextConfig);
