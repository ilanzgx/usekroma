import z from "zod";

export const envConfig = z
  .object({
    SERVER_HOST: z.string(),
    SERVER_PORT: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    DATABASE_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
    JWT_SECRET: z.string(),
    WORKER_IMAGE_URL: z.string(),
    FRONTEND_URL: z.string(),
  })
  .parse(process.env);
