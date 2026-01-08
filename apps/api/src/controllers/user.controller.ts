import { FastifyRequest, type FastifyInstance } from "fastify";
import { listUsersUseCase } from "@/usecases/user/list-users.usecase";
import { getUserByEmailUseCase } from "@/usecases/user/get-user-by-email.usecase";

export const userController = (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const users = await listUsersUseCase.execute();
    return users;
  });

  fastify.get("/me", async (req: FastifyRequest) => {
    const user = await getUserByEmailUseCase.execute(req.user.email);
    return user;
  });
};
