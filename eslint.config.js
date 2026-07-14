import js from "@eslint/js";

// Configuration ESLint (flat config). Le jeu tourne en modules ES natifs dans
// le navigateur ; les tests tournent sous Node/Vitest.
export default [
  {
    ignores: ["node_modules/", "coverage/"],
  },
  js.configs.recommended,
  {
    files: ["games/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        performance: "readonly",
        requestAnimationFrame: "readonly",
      },
    },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
