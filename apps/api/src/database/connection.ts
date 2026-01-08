import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/database/schema/users.schema";
import { databaseConfig, DATABASE_URL } from "@/config/database.config";

const client = postgres(DATABASE_URL, databaseConfig);

export const db = drizzle(client, {
  schema,
});
