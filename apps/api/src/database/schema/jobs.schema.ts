import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "done",
  "failed",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: jobStatusEnum("status").default("pending").notNull(),
  operation: text("operation").notNull(),
  params: jsonb("params").$type<{ width?: number; height?: number }>(),
  originalKey: text("original_key").notNull(),
  resultKey: text("result_key"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
