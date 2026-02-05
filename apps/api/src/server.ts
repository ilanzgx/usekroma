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
import { envConfig } from "@/config/env.config";
import ScalarApiReference from "@scalar/fastify-api-reference";
import closeWithGrace from "close-with-grace";

// ********************************************
// Fastify instance
// ********************************************

const app = fastify({
  trustProxy: true,
  logger:
    envConfig.NODE_ENV !== "production"
      ? {
          level: envConfig.LOG_LEVEL,
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        }
      : {
          level: envConfig.LOG_LEVEL,
        },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// ********************************************
// Plugins
// ********************************************

app.register(fastifyCors, corsConfig); // Cors plugin
app.register(fastifyCookie); // Cookie plugin
app.register(fastifySwagger, swaggerConfig); // Swagger plugin
app.register(ScalarApiReference, {
  routePrefix: "/docs",
}); // Scalar API Reference plugin
app.register(fastifyOauth2, googleOAuthConfig); // OAuth2 plugin
app.register(fastifyJwt, jwtConfig); // JWT plugin
app.register(fastifyMultipart, multipartConfig); // Multipart plugin
app.register(routes); // Routes

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
    port: Number(envConfig.SERVER_PORT),
    host: envConfig.SERVER_HOST,
  })
  .then(() => {
    console.log(
      `HTTP Server running on http://${envConfig.SERVER_HOST}:${envConfig.SERVER_PORT}`,
    );
    console.log(
      `API Reference available at http://${envConfig.SERVER_HOST}:${envConfig.SERVER_PORT}/docs`,
    );
  });
