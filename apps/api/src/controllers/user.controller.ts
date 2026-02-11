import { FastifyReply, FastifyRequest, type FastifyInstance } from "fastify";
import { ListUsersUseCase } from "@/usecases/user/list-users.usecase";
import { GetUserByEmailUseCase } from "@/usecases/user/get-user-by-email.usecase";

export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  async listUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await this.listUsersUseCase.execute();
    return reply.status(200).send(users);
  }

  async getUserByEmail(req: FastifyRequest, reply: FastifyReply) {
    const user = await this.getUserByEmailUseCase.execute(req.user.email);
    return reply.status(200).send(user);
  }
}
