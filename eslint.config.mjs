import eslintConfigPrettier from "eslint-config-prettier";
import webConfig from "./apps/web/eslint.config.mjs";

const nextConfigs = webConfig.slice(0, 4).map((config) =>
  Object.assign({}, config, {
    files: ["apps/web/**/*.{js,jsx,mjs,ts,tsx}"],
  }),
);

const tsConfigs = webConfig.slice(4, 8);

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/.venv/**",
      "**/.uv/**",
      "**/__pycache__/**",
      "**/next-env.d.ts",
      "**/.agents/**",
      "**/.git/**",
    ],
  },
  ...tsConfigs,
  ...nextConfigs,
  {
    files: ["apps/web/**"],
    settings: {
      next: {
        rootDir: "apps/web/",
      },
    },
  },
  eslintConfigPrettier,
];
