import { IUserRepository } from "@/repositories/user.repository.interface";

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
