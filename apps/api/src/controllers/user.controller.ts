import { FastifyReply, FastifyRequest, type FastifyInstance } from "fastify";
import { createUserUseCase } from "@/usecases/user/create-user.usecase";
import { NewUser } from "@/database";

export const userController = (fastify: FastifyInstance) => {
  fastify.post(
    "/",
    async (req: FastifyRequest<{ Body: NewUser }>, reply: FastifyReply) => {
      const { name, email } = req.body;
      const user = await createUserUseCase.execute({ name, email });
      return user;
    }
  );
};
