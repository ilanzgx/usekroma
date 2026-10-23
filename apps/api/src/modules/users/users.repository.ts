import { eq } from "drizzle-orm";
import { users, type User, type NewUser } from "@/shared/database";
import type { Database } from "@/shared/database";

export type CreateUserDto = NewUser;
export type UpdateUserDto = Partial<Omit<CreateUserDto, "id" | "createdAt">>;

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserDto): Promise<User>;
}

export class UserRepository implements IUserRepository {
  constructor(private readonly database: Database) {}

  async create(data: CreateUserDto): Promise<User> {
    const [result] = await this.database.insert(users).values(data).returning();
    return result;
  }

  async findById(id: string): Promise<User | undefined> {
    const [result] = await this.database.select().from(users).where(eq(users.id, id));
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [result] = await this.database.select().from(users).where(eq(users.email, email));
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
