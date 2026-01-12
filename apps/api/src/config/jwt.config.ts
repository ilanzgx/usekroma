import { FastifyJWTOptions } from "@fastify/jwt";

export const jwtConfig: FastifyJWTOptions = {
  secret: process.env.JWT_SECRET!,
  sign: {
    expiresIn: "7d",
  },
  cookie: {
    cookieName: "token",
    signed: false,
  },
};
