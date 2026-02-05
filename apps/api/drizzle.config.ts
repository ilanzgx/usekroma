import { defineConfig } from "drizzle-kit";
import { envConfig } from "./src/config/env.config";

export default defineConfig({
  schema: "./src/database/schema/*.schema.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: envConfig.DATABASE_URL,
  },
});
