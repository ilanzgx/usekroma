import { UserRepository } from "@/modules/users/users.repository";
import { db } from "@/shared/database";
import { GoogleAuthUseCase } from "./google-auth.usecase";
import { AuthController } from "./auth.controller";
import { envConfig } from "@/config/env.config";

const FRONTEND_URL = envConfig.FRONTEND_URL;

export function makeAuthController(): AuthController {
  const userRepository = new UserRepository(db);
  const googleAuthUseCase = new GoogleAuthUseCase(userRepository);

  return new AuthController(googleAuthUseCase, FRONTEND_URL);
}
