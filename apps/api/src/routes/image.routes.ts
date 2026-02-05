import { FastifyInstance } from "fastify";
import { ImageController } from "@/controllers/image.controller";

export async function imageRoutes(app: FastifyInstance) {
  const imageController = new ImageController();

  app.post("/process", imageController.uploadImage.bind(imageController));
}
