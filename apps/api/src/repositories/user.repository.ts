import { eq } from "drizzle-orm";
import { db } from "@/database";
import { users } from "@/database/schema/users.schema";
import { User, CreateUserDto, UpdateUserDto } from "@/models/user.model";

export class UserRepository {
  async create(data: CreateUserDto): Promise<User> {
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

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const [result] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result;
  }
}

export const userRepository = new UserRepository();
