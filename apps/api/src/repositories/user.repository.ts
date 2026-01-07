import { eq } from "drizzle-orm";
import { db } from "@/database";
import { users, type NewUser, type User } from "@/database/schema/users.schema";

export class UserRepository {
  async create(data: NewUser): Promise<User> {
    const [result] = await db.insert(users).values(data).returning();
    return result;
  }

  async findById(id: string): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result;
  }

  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }
}

export const userRepository = new UserRepository();
