import { FastifyJWTOptions } from "@fastify/jwt";
import { envConfig } from "@/config/env.config";

export const jwtConfig: FastifyJWTOptions = {
  secret: envConfig.JWT_SECRET,
  sign: {
    expiresIn: "7d",
  },
  cookie: {
    cookieName: "token",
    signed: false,
  },
};
