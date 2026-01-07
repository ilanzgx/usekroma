import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { db } from "@/database";
import { sql } from "drizzle-orm";
import { routes } from "@/routes";

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

app.get("/", (req, reply) => {
  return { message: "Hello World" };
});

app.get("/health", async (req, reply) => {
  try {
    await db.execute(sql`SELECT 1`);
    return { status: "ok", database: "connected" };
  } catch (error) {
    reply.status(503);
    return { status: "error", database: "disconnected", error: String(error) };
  }
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // credentials: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API",
      version: "1.0.0",
      description: "API description",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(routes);

try {
  app
    .listen({
      port: 8080,
      host: "0.0.0.0",
    })
    .then(() => {
      console.log("HTTP Server running on http://localhost:8080");
      console.log("API Reference available at http://localhost:8080/docs");
    });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
