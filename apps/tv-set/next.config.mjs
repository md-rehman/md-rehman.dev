/** @type {import('next').NextConfig} */

import { enableModuleFederation, loadEnv } from "@repo/build-plugins";

loadEnv();

const nextConfig = {
  appName: "tv-set",
  env: {
    APP_P5_PLAYGROUND: process.env.APP_P5_PLAYGROUND,
  },
  remotes: {
    "p5-playground": `p5-playground@https://www.md-rehman.dev/p5-playground/_next/static/chunks/remoteEntry.js`,
  },
};

export default enableModuleFederation(nextConfig);
