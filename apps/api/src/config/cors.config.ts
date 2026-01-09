import { FastifyCorsOptions } from "@fastify/cors";

export const corsConfig: FastifyCorsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
