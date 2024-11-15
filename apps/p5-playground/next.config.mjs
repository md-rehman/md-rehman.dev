/** @type {import('next').NextConfig} */

import { enableModuleFederation } from "@repo/build-plugins";

const nextConfig = {
  appName: "p5-playground",
  exposes: {
    "./Example": "./src/components/p5-sketches/example.tsx",
  },
};

// export default nextConfig;

export default enableModuleFederation(nextConfig);
