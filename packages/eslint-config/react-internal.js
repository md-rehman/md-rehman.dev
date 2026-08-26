const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const eslintConfigPrettier = require("eslint-config-prettier");
const globals = require("globals");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends("turbo"),
  {
    plugins: {
      "only-warn": require("eslint-plugin-only-warn"),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "writable",
        JSX: "writable",
      },
    },
    ignores: [".*.js", "node_modules/", "dist/"],
  },
];
