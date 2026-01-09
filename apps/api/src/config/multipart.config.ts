import { type FastifyMultipartOptions } from "@fastify/multipart";

export const multipartConfig: FastifyMultipartOptions = {
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
};
