import { FastifyCorsOptions } from "@fastify/cors";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const corsConfig: FastifyCorsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // cookies cross-origin
};
