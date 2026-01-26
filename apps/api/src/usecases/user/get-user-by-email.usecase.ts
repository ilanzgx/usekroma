import { UserRepository, userRepository } from "@/repositories/user.repository";

export class GetUserByEmailUseCase {
  constructor(private repository: UserRepository) {}

  async execute(email: string) {
    const user = await this.repository.findByEmail(email);
    return user;
  }
}

export const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
