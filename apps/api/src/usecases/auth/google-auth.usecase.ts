import { User } from "@/models/user.model";
import { IUserRepository } from "@/repositories/user.repository.interface";

export class GoogleAuthUseCase {
  constructor(private repository: IUserRepository) {}

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
