import { UserRepository, userRepository } from "@/repositories/user.repository";

export class ListUsersUseCase {
  constructor(private repository: UserRepository) {}

  async execute() {
    const users = await this.repository.findAll();
    return users;
  }
}

export const listUsersUseCase = new ListUsersUseCase(userRepository);
