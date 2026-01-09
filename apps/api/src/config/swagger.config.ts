import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: "API",
      version: "1.0.0",
      description: "API description",
    },
  },
  transform: jsonSchemaTransform,
};
