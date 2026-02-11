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
          max: 5,
          timeWindow: "1 minute",
        },
      },
      schema: {
        response: {
          200: zod.any().describe("Processed image as base64 or binary"),
          400: zod.object({
            message: zod.string().describe("No file uploaded"),
          }),
          401: zod.object({
            message: zod.string().describe("Unauthorized"),
          }),
          500: zod.object({
            message: zod.string().describe("Internal server error"),
          }),
        },
      },
    },
    controller.uploadImage.bind(controller),
  );
}
