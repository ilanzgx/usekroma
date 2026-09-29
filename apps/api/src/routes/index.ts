import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { imageRoutes } from "./image.routes";
import { jobRoutes } from "./job.routes";

import { db } from "@/database";
import { sql } from "drizzle-orm";

export async function routes(fastify: FastifyInstance) {
  fastify.get("/health", async (req, reply) => {
    try {
      await db.execute(sql`select 1`);
      return reply.status(200).send({
        status: "OK",
        database: "connected",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return reply.status(503).send({
        status: "Not OK",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      });
    }
  });

  fastify.register(userRoutes, {
    prefix: "/v1/users",
  });

  fastify.register(authRoutes, {
    prefix: "/v1/auth",
  });

  fastify.register(imageRoutes, {
    prefix: "/v1/images",
  });

  fastify.register(jobRoutes, {
    prefix: "/v1/jobs",
  });
}
