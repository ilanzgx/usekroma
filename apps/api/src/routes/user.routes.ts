import { FastifyInstance } from "fastify";
import { userController } from "@/controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  userController(fastify);
}
