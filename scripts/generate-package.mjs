#!/usr/bin/env node

/**
 * Generate a new shared package inside packages/
 *
 * Usage:
 *   yarn generate:package                  # interactive prompt
 *   yarn generate:package my-utils         # skip prompt
 */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const PACKAGES_DIR = join(ROOT, "packages");

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

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  let name = process.argv[2];

  if (!name) {
    name = await ask("Package name (kebab-case, without @repo/ prefix): ");
  }

  name = slugify(name);

  if (!name) {
    console.error("❌  A valid package name is required.");
    process.exit(1);
  }

  const scopedName = `@repo/${name}`;
  const pkgDir = join(PACKAGES_DIR, name);

  if (existsSync(pkgDir)) {
    console.error(`❌  packages/${name} already exists.`);
    process.exit(1);
  }

  console.log(`\n📦  Generating package: ${scopedName}`);
  console.log(`    📁  packages/${name}\n`);

  // ── directory tree ──

  mkdirSync(join(pkgDir, "src"), { recursive: true });

  // ── package.json ──

  writeFileSync(
    join(pkgDir, "package.json"),
    JSON.stringify(
      {
        name: scopedName,
        version: "0.0.0",
        private: true,
        exports: {
          ".": "./src/index.ts",
        },
        scripts: {
          lint: "eslint . --max-warnings 0",
          format:
            'prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss,md}" --ignore-path ../../.gitignore',
        },
        devDependencies: {
          "@repo/eslint-config": "*",
          "@repo/typescript-config": "*",
          "@types/node": "^20",
          eslint: "^8.57.0",
          typescript: "^5",
        },
        dependencies: {},
      },
      null,
      2,
    ) + "\n",
  );

  // ── tsconfig.json ──

  writeFileSync(
    join(pkgDir, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "@repo/typescript-config/base.json",
        compilerOptions: {
          outDir: "./dist",
          rootDir: "./src",
        },
        include: ["src"],
        exclude: ["node_modules", "dist"],
      },
      null,
      2,
    ) + "\n",
  );

  // ── .eslintrc.js ──

  writeFileSync(
    join(pkgDir, ".eslintrc.js"),
    `/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
`,
  );

  // ── src/index.ts ──

  writeFileSync(
    join(pkgDir, "src", "index.ts"),
    `/**
 * ${scopedName}
 *
 * Shared package for the md-rehman.dev monorepo.
 */

export {};
`,
  );

  console.log(`✅  packages/${name} created successfully.`);
  console.log(`\nNext steps:`);
  console.log(`  1. Run \`yarn install\` from the repo root`);
  console.log(`  2. Import with \`"${scopedName}": "*"\` in consuming apps\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
