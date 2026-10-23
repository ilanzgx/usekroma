import { FastifyInstance } from "fastify";
import { userRoutes } from "@/modules/users/users.routes";
import { authRoutes } from "@/modules/auth/auth.routes";
import { imageRoutes } from "@/modules/images/images.routes";
import { jobRoutes } from "@/modules/jobs/jobs.routes";
import { db } from "@/shared/database";
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
