import { FastifyCorsOptions } from "@fastify/cors";
import { envConfig } from "@/config/env.config";

export const corsConfig: FastifyCorsOptions = {
  origin: envConfig.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // cookies cross-origin
};
