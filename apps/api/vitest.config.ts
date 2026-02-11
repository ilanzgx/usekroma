import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
      },
      {
        test: {
          name: "integration",
          include: [
            "src/**/*.integration.test.ts",
            "src/**/*.integration.spec.ts",
          ],
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
      },
    ],
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules", "src/database/migrations", "**/*.config.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
