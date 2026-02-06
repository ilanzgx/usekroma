import { User } from "@/models/user.model";
import { UserRepository, userRepository } from "@/repositories/user.repository";

export class GoogleAuthUseCase {
  constructor(private repository: UserRepository) {}

  async execute({
    email,
    name,
    googleId,
    picture,
  }: {
    email: string;
    name: string;
    googleId: string;
    picture: string;
  }) {
    const user = await this.repository.findByEmail(email);
    if (user) {
      const newUser: User = await this.repository.update(user.id, {
        name,
        googleId,
        picture,
      });
      return newUser;
    }

    const newUser = await this.repository.create({
      email,
      name,
      googleId,
      picture,
      credits: 50,
    });

    return newUser;
  }
}

export const googleAuthUseCase = new GoogleAuthUseCase(userRepository);
