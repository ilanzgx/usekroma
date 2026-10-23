import { type IUserRepository } from "../users.repository";

export class GetUserByIdUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
