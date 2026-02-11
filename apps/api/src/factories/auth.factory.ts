import { UserRepository } from "@/repositories/user.repository";
import { db } from "@/database";
import { GoogleAuthUseCase } from "@/usecases/auth/google-auth.usecase";
import { AuthController } from "@/controllers/auth.controller";

export function makeAuthController(): AuthController {
  const userRepository = new UserRepository(db);
  const googleAuthUseCase = new GoogleAuthUseCase(userRepository);

  return new AuthController(googleAuthUseCase);
}