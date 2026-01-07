import { NewUser } from "@/database";
import { UserRepository } from "@/repositories/user.repository";

export class CreateUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(data: NewUser) {
    const user = await this.repository.create(data);
    return user;
  }
}

const userRepository = new UserRepository();
export const createUserUseCase = new CreateUserUseCase(userRepository);
