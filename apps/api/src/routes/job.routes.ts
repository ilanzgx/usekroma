import { FastifyInstance } from "fastify";
import { jobController } from "@/controllers/job.controller";

export async function jobRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: "1 minute",
        },
      },
    },
    jobController.list.bind(jobController),
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      config: {
        rateLimit: {
          max: 120,
          timeWindow: "1 minute",
        },
      },
    },
    jobController.getStatus.bind(jobController),
  );

  app.get<{ Params: { id: string } }>(
    "/:id/result",
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: "1 minute",
        },
      },
    },
    jobController.getResult.bind(jobController),
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      config: {
        rateLimit: {
          max: 30,
          timeWindow: "1 minute",
        },
      },
    },
    jobController.delete.bind(jobController),
  );
}
