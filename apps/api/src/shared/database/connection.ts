import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as usersSchema from "@/shared/database/schema/users.schema";
import * as jobsSchema from "@/shared/database/schema/jobs.schema";
import { databaseConfig, DATABASE_URL } from "@/config/database.config";

const client = postgres(DATABASE_URL, databaseConfig);

export const db = drizzle(client, {
  schema: { ...usersSchema, ...jobsSchema },
});

export type Database = typeof db;
