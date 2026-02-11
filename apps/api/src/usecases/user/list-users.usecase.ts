import { IUserRepository } from "@/repositories/user.repository.interface";

export class ListUsersUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute() {
    const users = await this.repository.findAll();
    return users;
  }
}
