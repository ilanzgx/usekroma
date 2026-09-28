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
    STORAGE_ENDPOINT: z.string(),
    STORAGE_REGION: z.string().default("us-east-1"),
    STORAGE_ACCESS_KEY: z.string(),
    STORAGE_SECRET_KEY: z.string(),
    STORAGE_BUCKET: z.string().default("kroma-storage"),
    RABBITMQ_URL: z.string().default("amqp://kroma:kroma@localhost:5672"),
  })
  .parse(process.env);
