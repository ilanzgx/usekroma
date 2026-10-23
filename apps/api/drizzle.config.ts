import { defineConfig } from "drizzle-kit";
import "dotenv";

export default defineConfig({
  schema: "./src/shared/database/schema/*.schema.ts",
  out: "./src/shared/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
