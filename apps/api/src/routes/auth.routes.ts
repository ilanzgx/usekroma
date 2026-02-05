import { FastifyInstance } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import { JWT } from "@fastify/jwt";
import { AuthController } from "@/controllers/auth.controller";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    jwt: JWT;
  }
}

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();

  app.get(
    "/google/callback",
    authController.googleCallback.bind(authController),
  );
  app.post("/logout", authController.logout.bind(authController));
}
