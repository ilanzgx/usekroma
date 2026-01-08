import { UserRepository } from "@/repositories/user.repository";

export class ListUsersUseCase {
  constructor(private repository: UserRepository) {}

  async execute() {
    const users = await this.repository.findAll();
    return users;
  }
}

const userRepository = new UserRepository();
export const listUsersUseCase = new ListUsersUseCase(userRepository);
