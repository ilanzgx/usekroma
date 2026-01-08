import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifyCookie } from "@fastify/cookie";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyOauth2 } from "@fastify/oauth2";
import { fastifyJwt } from "@fastify/jwt";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { routes } from "@/routes";
import { googleOAuthConfig } from "@/config/oauth.config";
import { jwtConfig } from "@/config/jwt.config";

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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.register(fastifyCookie);

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

app.register(fastifyOauth2, googleOAuthConfig);

app.register(fastifyJwt, jwtConfig);

app.register(routes);

app
  .listen({
    port: 8080,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP Server running on http://localhost:8080");
    console.log("API Reference available at http://localhost:8080/docs");
  });

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await app.close();
    console.log("Server closed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
