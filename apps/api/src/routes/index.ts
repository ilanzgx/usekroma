import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";

export async function routes(fastify: FastifyInstance) {
  fastify.register(userRoutes, {
    prefix: "/v1/users",
  });

  fastify.register(authRoutes, {
    prefix: "/v1/auth",
  });
}
