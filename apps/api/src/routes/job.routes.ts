import { FastifyInstance } from "fastify";
import { jobController } from "@/controllers/job.controller";

export async function jobRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/:id",
    jobController.getStatus.bind(jobController),
  );

  app.get<{ Params: { id: string } }>(
    "/:id/result",
    jobController.getResult.bind(jobController),
  );
}
