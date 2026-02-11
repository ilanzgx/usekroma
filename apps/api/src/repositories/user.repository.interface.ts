import { User, CreateUserDto, UpdateUserDto } from "@/models/user.model";

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserDto): Promise<User>;
}