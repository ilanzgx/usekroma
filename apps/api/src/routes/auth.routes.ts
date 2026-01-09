import { FastifyInstance } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import { JWT } from "@fastify/jwt";
import { authController } from "@/controllers/auth.controller";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    jwt: JWT;
  }
}

export async function authRoutes(fastify: FastifyInstance) {
  authController(fastify);
}
