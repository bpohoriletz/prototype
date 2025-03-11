// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["cdk.out/", "node_modules/", "eslint.config.mjs", "jest.config.js"],
    rules: {
      "no-prototype-builtins": "off",
      "no-trailing-spaces": "error",
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
    },
  }
);
