import { eq } from "drizzle-orm";
import { users } from "@/database/schema/users.schema";
import { User, CreateUserDto, UpdateUserDto } from "@/models/user.model";
import type { Database } from "@/database/connection";
import { IUserRepository } from "./user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private readonly database: Database) {}

  async create(data: CreateUserDto): Promise<User> {
    const [result] = await this.database.insert(users).values(data).returning();
    return result;
  }

  async findById(id: string): Promise<User | undefined> {
    const [result] = await this.database
      .select()
      .from(users)
      .where(eq(users.id, id));
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [result] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result;
  }

  async findAll(): Promise<User[]> {
    return this.database.select().from(users);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const [result] = await this.database
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result;
  }
}
