import { UserRepository } from "@/repositories/user.repository";
import { ListUsersUseCase } from "@/usecases/user/list-users.usecase";
import { GetUserByEmailUseCase } from "@/usecases/user/get-user-by-email.usecase";
import { UserController } from "@/controllers/user.controller";
import { db } from "@/database";

export function makeUserController(): UserController {
  const userRepository = new UserRepository(db);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);

  return new UserController(listUsersUseCase, getUserByEmailUseCase);
}
