import { FastifyInstance } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import { JWT } from "@fastify/jwt";
import { makeAuthController } from "@/factories/auth.factory";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    jwt: JWT;
  }
}

export async function authRoutes(app: FastifyInstance) {
  const controller = makeAuthController();

  app.get("/google/callback", controller.googleCallback.bind(controller));
  app.post("/logout", controller.logout.bind(controller));
}
