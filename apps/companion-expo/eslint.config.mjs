import expoConfig from "eslint-config-expo/flat.js";

export default [
  ...expoConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
  {
    ignores: ["node_modules/", ".expo/", "dist/"],
  },
];
