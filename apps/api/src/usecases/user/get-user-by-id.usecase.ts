import { UserRepository } from "@/repositories/user.repository";

export class GetUserByIdUseCase {
  constructor(private repository: UserRepository) {}

  async execute(id: string) {
    const user = await this.repository.findById(id);
    return user;
  }
}

const userRepository = new UserRepository();
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
