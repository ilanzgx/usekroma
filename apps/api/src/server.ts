import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifyCookie } from "@fastify/cookie";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyOauth2 } from "@fastify/oauth2";
import { fastifyJwt } from "@fastify/jwt";
import { fastifyMultipart } from "@fastify/multipart";
import { routes } from "@/routes";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { googleOAuthConfig } from "@/config/oauth.config";
import { jwtConfig } from "@/config/jwt.config";
import { multipartConfig } from "@/config/multipart.config";
import { swaggerConfig } from "@/config/swagger.config";
import { corsConfig } from "@/config/cors.config";
import ScalarApiReference from "@scalar/fastify-api-reference";
import closeWithGrace from "close-with-grace";

// ********************************************
// Fastify instance
// ********************************************
const isDev = process.env.NODE_ENV !== "production";

const app = fastify({
  trustProxy: true,
  logger: isDev
    ? {
        level: process.env.LOG_LEVEL || "info",
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
      }
    : {
        level: process.env.LOG_LEVEL || "info",
      },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// ********************************************
// Plugins
// ********************************************

// Cors plugin
app.register(fastifyCors, corsConfig);

// Cookie plugin
app.register(fastifyCookie);

// Swagger plugin
app.register(fastifySwagger, swaggerConfig);

// Scalar API Reference plugin
app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

// OAuth2 plugin
app.register(fastifyOauth2, googleOAuthConfig);

// JWT plugin
app.register(fastifyJwt, jwtConfig);

// Multipart plugin
app.register(fastifyMultipart, multipartConfig);

// Routes plugin
app.register(routes);

// ********************************************
// Global Auth Middleware
// ********************************************
app.addHook("preHandler", authMiddleware);

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
