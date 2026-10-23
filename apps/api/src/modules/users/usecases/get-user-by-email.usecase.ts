import { type IUserRepository } from "../users.repository";

export class GetUserByEmailUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
