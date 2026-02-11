import { CreateUserDto } from "@/models/user.model";
import { IUserRepository } from "@/repositories/user.repository.interface";

export class CreateUserUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(data: CreateUserDto) {
    const user = await this.repository.create(data);
    return user;
  }
}
