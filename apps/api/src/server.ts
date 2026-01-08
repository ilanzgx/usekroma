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
import closeWithGrace from "close-with-grace";
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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// ********************************************
// Plugins
// ********************************************

// Cors plugin
app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

// Cookie plugin
app.register(fastifyCookie);

// Swagger plugin
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

// Scalar API Reference plugin
app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

// OAuth2 plugin
app.register(fastifyOauth2, googleOAuthConfig);

// JWT plugin
app.register(fastifyJwt, jwtConfig);

// Routes plugin
app.register(routes);

// ********************************************
// Server initialization
// ********************************************

closeWithGrace(async ({ signal, err }) => {
  if (err) {
    app.log.error({ err }, "server closing with error");
  } else {
    app.log.info(`${signal} received, server closing`);
  }
  await app.close();
});

app
  .listen({
    port: 8080,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP Server running on http://localhost:8080");
    console.log("API Reference available at http://localhost:8080/docs");
  });
