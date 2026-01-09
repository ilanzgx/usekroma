import { FastifyInstance } from "fastify";

export const imageController = (fastify: FastifyInstance) => {
  fastify.post("/", async (req, reply) => {
    return {
      message: "Hello World",
    };
  });
};
