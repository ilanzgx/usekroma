import { FastifyRequest, FastifyReply } from "fastify";
import { db, jobs } from "@/database";
import { eq, and } from "drizzle-orm";
import { storage } from "@/lib/storage";
import type { JobDTO, JobStatus } from "@kroma/shared";

export class JobController {
  async getStatus(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    const userId = req.user.userId;

    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));

    if (!job) {
      return reply.status(404).send({ error: "Job not found" });
    }

    const response: JobDTO = {
      id: job.id,
      status: job.status as JobStatus,
      operation: job.operation,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    };

    return reply.status(200).send(response);
  }

  async getResult(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    const userId = req.user.userId;

    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));

    if (!job) {
      return reply.status(404).send({ error: "Job not found" });
    }

    if (job.status !== "done" || !job.resultKey) {
      return reply.status(400).send({
        error: "Job is not completed yet",
        status: job.status,
      });
    }

    try {
      const buffer = await storage.download(job.resultKey);

      return reply
        .status(200)
        .header("Content-Type", "image/png")
        .header("Content-Disposition", `inline; filename="${job.id}.png"`)
        .send(buffer);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        error: "Failed to download result image",
      });
    }
  }
}

export const jobController = new JobController();
