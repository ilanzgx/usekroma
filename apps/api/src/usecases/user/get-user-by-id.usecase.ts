import { UserRepository, userRepository } from "@/repositories/user.repository";

export class GetUserByIdUseCase {
  constructor(private repository: UserRepository) {}

  async execute(id: string) {
    const user = await this.repository.findById(id);
    return user;
  }
}

export const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
