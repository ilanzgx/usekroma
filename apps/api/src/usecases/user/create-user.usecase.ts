import { CreateUserDto } from "@/models/user.model";
import { UserRepository, userRepository } from "@/repositories/user.repository";

export class CreateUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(data: CreateUserDto) {
    const user = await this.repository.create(data);
    return user;
  }
}

export const createUserUseCase = new CreateUserUseCase(userRepository);
