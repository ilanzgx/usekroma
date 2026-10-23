import { FastifyInstance } from "fastify";
import { makeUserController } from "./users.factory";

export async function userRoutes(app: FastifyInstance) {
  const controller = makeUserController();

  app.get("/", controller.listUsers.bind(controller));
  app.get("/me", controller.getUserByEmail.bind(controller));
}
