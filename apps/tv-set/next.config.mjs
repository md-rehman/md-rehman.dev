/** @type {import('next').NextConfig} */

import { enableModuleFederation, loadEnv } from "@repo/build-plugins";

loadEnv();

const nextConfig = {
  appName: "tv-set",
  env: {
    APP_P5_PLAYGROUND: process.env.APP_P5_PLAYGROUND,
  },
  remotes: {
    "p5-playground": `p5-playground@${process.env.APP_P5_PLAYGROUND}_next/static/chunks/remoteEntry.js`,
  },
};

export default enableModuleFederation(nextConfig);
