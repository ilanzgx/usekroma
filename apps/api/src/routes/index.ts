import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { imageRoutes } from "./image.routes";

export async function routes(fastify: FastifyInstance) {
  fastify.register(userRoutes, {
    prefix: "/v1/users",
  });

  fastify.register(authRoutes, {
    prefix: "/v1/auth",
  });

  fastify.register(imageRoutes, {
    prefix: "/v1/images",
  });
}
