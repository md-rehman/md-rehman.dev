#!/usr/bin/env node

/**
 * Generate a new Next.js app inside apps/
 *
 * Usage:
 *   yarn generate:app                  # interactive prompt
 *   yarn generate:app my-new-app       # skip prompt, still asks for port
 */

import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const APPS_DIR = join(ROOT, "apps");
const HOME_VERCEL_JSON = join(ROOT, "apps", "home", "vercel.json");
const README_PATH = join(ROOT, "README.md");

// ── helpers ────────────────────────────────────────────────────────────────

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (a) => { rl.close(); res(a.trim()); }));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Collect all ports currently in use across apps. */
function usedPorts() {
  const ports = new Set();
  for (const dir of readdirSync(APPS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const pkgPath = join(APPS_DIR, dir.name, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const devScript = pkg.scripts?.dev ?? "";
    const match = devScript.match(/--port\s+(\d+)/);
    if (match) ports.add(Number(match[1]));
  }
  return ports;
}

/** Suggest the next available port (highest existing + 1). */
function suggestPort(ports) {
  if (ports.size === 0) return 3001;
  return Math.max(...ports) + 1;
}

/** Add rewrite rules for the new app to apps/home/vercel.json */
function updateVercelJson(name) {
  if (!existsSync(HOME_VERCEL_JSON)) {
    console.warn("⚠️   apps/home/vercel.json not found — skipping vercel.json update.");
    return;
  }

  const vercel = JSON.parse(readFileSync(HOME_VERCEL_JSON, "utf-8"));
  const rewrites = vercel.rewrites || [];
  const vercelAppName = `md-rehman-dev-${name}`;
  const destination = `https://${vercelAppName}.vercel.app/${name}`;

  // Check if rewrites already exist for this app
  const alreadyExists = rewrites.some((r) => r.source === `/${name}`);
  if (alreadyExists) {
    console.log(`    ℹ️  vercel.json already has rewrites for /${name} — skipping.`);
    return;
  }

  rewrites.push(
    {
      source: `/${name}`,
      destination,
    },
    {
      source: `/${name}/:match*`,
      destination: `${destination}/:match*`,
    },
  );

  vercel.rewrites = rewrites;
  writeFileSync(HOME_VERCEL_JSON, JSON.stringify(vercel, null, 2) + "\n");
  console.log(`    ✏️  Updated apps/home/vercel.json with /${name} rewrites`);
}

/** Append a row to the port table in README.md */
function updateReadme(name, port) {
  if (!existsSync(README_PATH)) {
    console.warn("⚠️   README.md not found — skipping README update.");
    return;
  }

  let readme = readFileSync(README_PATH, "utf-8");

  // Find the port table — look for the last row line (starts with |)
  // The table ends before the blank line or _NOTE_ line
  const lines = readme.split("\n");
  let lastTableRowIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match table data rows (not header or separator)
    if (line.startsWith("|") && line.includes("`") && !line.includes("**App Name**")) {
      lastTableRowIndex = i;
    }
  }

  if (lastTableRowIndex === -1) {
    console.warn("⚠️   Could not find port table in README.md — skipping README update.");
    return;
  }

  // Pad the name and port columns to match existing alignment
  const appCol = `\`${name}\``.padEnd(15);
  const portCol = `\`${port}\``.padEnd(8);
  const newRow = `| ${appCol} | ${portCol} | -                                            |`;

  lines.splice(lastTableRowIndex + 1, 0, newRow);

  writeFileSync(README_PATH, lines.join("\n"));
  console.log(`    ✏️  Updated README.md port table`);
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  let name = process.argv[2];

  if (!name) {
    name = await ask("App name (kebab-case): ");
  }

  name = slugify(name);

  if (!name) {
    console.error("❌  A valid app name is required.");
    process.exit(1);
  }

  const appDir = join(APPS_DIR, name);

  if (existsSync(appDir)) {
    console.error(`❌  apps/${name} already exists.`);
    process.exit(1);
  }

  // ── port selection ──

  const ports = usedPorts();
  const suggested = suggestPort(ports);

  console.log(`\n📋  Ports currently in use: ${[...ports].sort((a, b) => a - b).join(", ")}`);

  const portInput = await ask(`Port number (default: ${suggested}): `);
  const port = portInput ? Number(portInput) : suggested;

  if (isNaN(port) || port < 1024 || port > 65535) {
    console.error("❌  Invalid port number. Must be between 1024 and 65535.");
    process.exit(1);
  }

  if (ports.has(port)) {
    console.error(`❌  Port ${port} is already in use by another app.`);
    process.exit(1);
  }

  console.log(`\n🚀  Generating app: ${name}`);
  console.log(`    📁  apps/${name}`);
  console.log(`    🌐  basePath: /${name}`);
  console.log(`    🔌  dev port: ${port}\n`);

  // ── directory tree ──

  mkdirSync(join(appDir, "app"), { recursive: true });
  mkdirSync(join(appDir, "public"), { recursive: true });

  // ── package.json ──

  writeFileSync(
    join(appDir, "package.json"),
    JSON.stringify(
      {
        name,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: `next dev --turbopack --port ${port}`,
          build: "next build",
          start: "next start",
          lint: "next lint",
          format:
            'prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss,md}" --ignore-path ../../.gitignore',
        },
        dependencies: {
          "@repo/ui": "*",
          next: "16.2.9",
          react: "^19.2.0",
          "react-dom": "^19.2.0",
        },
        devDependencies: {
          "@repo/eslint-config": "*",
          "@repo/typescript-config": "*",
          "@types/node": "^20",
          "@types/react": "^19.2.0",
          "@types/react-dom": "^19.2.0",
          eslint: "^9",
          "eslint-config-next": "16.2.9",
          typescript: "^5",
        },
      },
      null,
      2,
    ) + "\n",
  );

  // ── next.config.ts ──

  writeFileSync(
    join(appDir, "next.config.ts"),
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/${name}",
};

export default nextConfig;
`,
  );

  // ── tsconfig.json ──

  writeFileSync(
    join(appDir, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "@repo/typescript-config/nextjs.json",
        compilerOptions: {
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./app/*"] },
        },
        include: [
          "next-env.d.ts",
          "next.config.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
        ],
        exclude: ["node_modules"],
      },
      null,
      2,
    ) + "\n",
  );

  // ── eslint config ──

  writeFileSync(
    join(appDir, "eslint.config.mjs"),
    `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

export default eslintConfig;
`,
  );

  // ── .gitignore ──

  writeFileSync(
    join(appDir, ".gitignore"),
    `# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,
  );

  // ── app/globals.css ──

  writeFileSync(
    join(appDir, "app", "globals.css"),
    `:root {
  --background: #0a0a0a;
  --foreground: #ededed;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}
`,
  );

  // ── app/layout.tsx ──

  const titleCase = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  writeFileSync(
    join(appDir, "app", "layout.tsx"),
    `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${titleCase}",
  description: "${titleCase} — md-rehman.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  );

  // ── app/page.tsx ──

  writeFileSync(
    join(appDir, "app", "page.tsx"),
    `export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>${titleCase}</h1>
    </main>
  );
}
`,
  );

  // ── update vercel.json ──

  updateVercelJson(name);

  // ── update README.md ──

  updateReadme(name, port);

  console.log(`\n✅  apps/${name} created successfully.`);
  console.log(`\nNext steps:`);
  console.log(`  1. Run \`yarn install\` from the repo root`);
  console.log(`  2. Run \`yarn dev --filter=${name}\` to start developing\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
