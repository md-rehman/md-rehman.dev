/** @type {import('next').NextConfig} */

import { enableModuleFederation } from "@repo/build-plugins";

const nextConfig = {
  appName: "tv-set",
  remotes: {
    "p5-playground":
      "p5-playground@http://localhost:3005/_next/static/chunks/remoteEntry.js",
  },
};

// export default nextConfig;

export default enableModuleFederation(nextConfig);
