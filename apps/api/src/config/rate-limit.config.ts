import { FastifyRateLimitOptions } from "@fastify/rate-limit";
import { FastifyRequest } from "fastify";

export const rateLimitConfig: FastifyRateLimitOptions = {
  max: 15,
  timeWindow: "1 minute",
  keyGenerator: (req: FastifyRequest) => req.user?.userId || req.ip,
};
