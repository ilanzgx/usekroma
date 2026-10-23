import { type CreateUserDto, type IUserRepository } from "../users.repository";

export class CreateUserUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(data: CreateUserDto) {
    const user = await this.repository.create(data);
    return user;
  }
}
