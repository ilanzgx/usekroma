import { users } from "@/database/schema/users.schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export type CreateUserDto = InferInsertModel<typeof users>;

export type UpdateUserDto = Partial<Omit<CreateUserDto, "id" | "createdAt">>;

export type UserPublic = Omit<User, "password">;