import { UserRepository } from "@/repositories/user.repository";

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
      await this.repository.update(user.id, {
        name,
        googleId,
        picture,
      });
      return user;
    }

    const newUser = await this.repository.create({
      email,
      name,
      googleId,
      picture,
    });

    return newUser;
  }
}
const userRepository = new UserRepository();
export const googleAuthUseCase = new GoogleAuthUseCase(userRepository);
