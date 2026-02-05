import { FastifyReply, FastifyRequest } from "fastify";

export interface JwtPayload {
  userId: string;
  email: string;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module "fastify" {
  interface FastifyContextConfig {
    public?: boolean;
  }
}

const PUBLIC_ROUTES = [
  "/health",
  "/docs",
  "/docs/openapi.json",
  "/v1/auth/google",
  "/v1/auth/google/callback",
  "/v1/auth/logout",
];

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (request.routeOptions.config?.public) {
    return;
  }

  if (PUBLIC_ROUTES.some((route) => request.url.startsWith(route))) {
    return;
  }

  try {
    await request.jwtVerify();
  } catch (error) {
    reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid or missing authentication token",
    });
    return;
  }
}
