import { FastifyRateLimitOptions } from "@fastify/rate-limit";
import { FastifyRequest } from "fastify";

export const rateLimitConfig: FastifyRateLimitOptions = {
  max: 100,
  timeWindow: "1 minute",
  hook: "preHandler",
  keyGenerator: (req: FastifyRequest) => {
    return (
      req.user?.userId ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip
    );
  },
};
