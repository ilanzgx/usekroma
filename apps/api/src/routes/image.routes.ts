import { imageController } from "@/controllers/image.controller";
import { FastifyInstance } from "fastify";

export async function imageRoutes(fastify: FastifyInstance) {
  imageController(fastify);
}
