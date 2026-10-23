import { UserRepository } from "./users.repository";
import { ListUsersUseCase } from "./usecases/list-users.usecase";
import { GetUserByEmailUseCase } from "./usecases/get-user-by-email.usecase";
import { UserController } from "./users.controller";
import { db } from "@/shared/database";

export function makeUserController(): UserController {
  const userRepository = new UserRepository(db);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);

  return new UserController(listUsersUseCase, getUserByEmailUseCase);
}
