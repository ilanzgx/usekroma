import { FastifyReply, FastifyRequest, type FastifyInstance } from "fastify";
import { listUsersUseCase } from "@/usecases/user/list-users.usecase";
import { getUserByEmailUseCase } from "@/usecases/user/get-user-by-email.usecase";

export class UserController {
  async listUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await listUsersUseCase.execute();
    return reply.status(200).send(users);
  }

  async getUserByEmail(req: FastifyRequest, reply: FastifyReply) {
    const user = await getUserByEmailUseCase.execute(req.user.email);
    return reply.status(200).send(user);
  }
}
