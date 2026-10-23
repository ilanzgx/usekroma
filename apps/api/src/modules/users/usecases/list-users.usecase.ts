import { type IUserRepository } from "../users.repository";

export class ListUsersUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute() {
    const users = await this.repository.findAll();
    return users;
  }
}
