import { FastifyRequest, FastifyReply } from "fastify";
import { db, jobs } from "@/database";
import { eq, and, lt, desc, sql } from "drizzle-orm";
import { storage } from "@/lib/storage";
import type {
  JobDTO,
  JobStatus,
  ListJobsQuery,
  ListJobsResponse,
  DeleteJobResponse,
} from "@kroma/shared";

export class JobController {
  async list(req: FastifyRequest<{ Querystring: ListJobsQuery }>, reply: FastifyReply) {
    const userId = req.user.userId;
    const { status, operation, limit = 50, offset = 0 } = req.query;

    const conditions = [eq(jobs.userId, userId)];
    if (status) {
      conditions.push(eq(jobs.status, status));
    }
    if (operation) {
      conditions.push(eq(jobs.operation, operation));
    }

    const whereClause = and(...conditions);

    const userJobs = await db
      .select()
      .from(jobs)
      .where(whereClause)
      .orderBy(desc(jobs.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(whereClause);

    const total = Number(countResult?.count ?? 0);

    const response: ListJobsResponse = {
      jobs: userJobs.map((job) => ({
        id: job.id,
        status: job.status as JobStatus,
        operation: job.operation,
        params: job.params,
        errorMessage: job.errorMessage,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      })),
      total,
    };

    return reply
      .status(200)
      .header("Cache-Control", "private, no-cache, no-store, must-revalidate")
      .send(response);
  }

  async getStatus(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = req.params;
    const userId = req.user.userId;

    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));

    if (!job) {
      return reply.status(404).send({ error: "Job not found" });
    }

    let queuePosition: number | null = null;

    if (job.status === "pending") {
      const [positionResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(jobs)
        .where(and(eq(jobs.status, "pending"), lt(jobs.createdAt, job.createdAt)));

      queuePosition = Number(positionResult?.count ?? 0) + 1;
    }

    const response: JobDTO = {
      id: job.id,
      status: job.status as JobStatus,
      operation: job.operation,
      params: job.params,
      queuePosition,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    };

    return reply
      .status(200)
      .header("Cache-Control", "private, no-cache, no-store, must-revalidate")
      .send(response);
  }

  async getResult(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
        .header("Cache-Control", "private, no-cache, no-store, must-revalidate")
        .send(buffer);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        error: "Failed to download result image",
      });
    }
  }

  async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = req.params;
    const userId = req.user.userId;

    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));

    if (!job) {
      return reply.status(404).send({ error: "Job not found" });
    }

    if (job.originalKey) {
      try {
        await storage.delete(job.originalKey);
      } catch (err) {
        req.log.warn(`Failed to delete original storage key: ${job.originalKey}`);
      }
    }

    if (job.resultKey) {
      try {
        await storage.delete(job.resultKey);
      } catch (err) {
        req.log.warn(`Failed to delete result storage key: ${job.resultKey}`);
      }
    }

    await db.delete(jobs).where(and(eq(jobs.id, id), eq(jobs.userId, userId)));

    const response: DeleteJobResponse = {
      success: true,
      jobId: id,
    };

    return reply.status(200).send(response);
  }
}

export const jobController = new JobController();
