import { FastifyInstance } from "fastify";
import { z as zod } from "zod";
import { makeImageController } from "@/factories/image.factory";

export async function imageRoutes(app: FastifyInstance) {
  const controller = makeImageController();

  app.post(
    "/process",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
      schema: {
        response: {
          202: zod.object({
            jobId: zod.string().describe("Async job ID for polling"),
            status: zod.literal("pending").describe("Initial job status"),
          }),
          400: zod.object({
            error: zod.string().describe("No file uploaded"),
          }),
          401: zod.object({
            error: zod.string().describe("Unauthorized"),
            message: zod.string(),
          }),
          500: zod.object({
            error: zod.string().describe("Internal server error"),
            message: zod.string(),
          }),
        },
      },
    },
    controller.uploadImage.bind(controller),
  );
}
