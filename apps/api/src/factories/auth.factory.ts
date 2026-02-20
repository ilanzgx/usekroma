import { UserRepository } from "@/repositories/user.repository";
import { db } from "@/database";
import { GoogleAuthUseCase } from "@/usecases/auth/google-auth.usecase";
import { AuthController } from "@/controllers/auth.controller";

import { envConfig } from "@/config/env.config";

const FRONTEND_URL = envConfig.FRONTEND_URL;

export function makeAuthController(): AuthController {
  const userRepository = new UserRepository(db);
  const googleAuthUseCase = new GoogleAuthUseCase(userRepository);

  return new AuthController(googleAuthUseCase, FRONTEND_URL);
}
