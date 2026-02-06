import { FastifyInstance } from "fastify";
import { ImageController } from "@/controllers/image.controller";
import { z as zod } from "zod";

export async function imageRoutes(app: FastifyInstance) {
  const imageController = new ImageController();

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
          200: zod.string().describe("Processed image as binary"),
          400: zod.string().describe("No file uploaded"),
          401: zod.string().describe("Unauthorized"),
          500: zod.string().describe("Internal server error"),
        },
      },
    },
    imageController.uploadImage.bind(imageController),
  );
}
