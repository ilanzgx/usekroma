import { describe, it, vi, expect, beforeEach } from "vitest";
import { JobController } from "@/controllers/job.controller";
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "@/database";
import { storage } from "@/lib/storage";

vi.mock("@/database", () => ({
  db: {
    select: vi.fn(),
    delete: vi.fn(),
  },
  jobs: {
    id: "id",
    userId: "user_id",
    status: "status",
    operation: "operation",
    createdAt: "created_at",
  },
}));

vi.mock("@/lib/storage", () => ({
  storage: {
    download: vi.fn(),
    delete: vi.fn(),
  },
}));

const createMockReply = (): FastifyReply => {
  const reply = {
    status: vi.fn(),
    header: vi.fn(),
    send: vi.fn(),
  };
  reply.status.mockReturnValue(reply);
  reply.header.mockReturnValue(reply);
  return reply as unknown as FastifyReply;
};

describe("JobController unit tests", () => {
  let sut: JobController;

  beforeEach(() => {
    vi.clearAllMocks();
    sut = new JobController();
  });

  describe("list endpoint", () => {
    it("should list jobs for the authenticated user", async () => {
      const dbJobs = [
        {
          id: "job-1",
          userId: "user-123",
          status: "done",
          operation: "remove_background",
          params: null,
          errorMessage: null,
          createdAt: new Date("2026-10-01"),
          completedAt: new Date("2026-10-01"),
        },
      ];

      const expectedJobs = [
        {
          id: "job-1",
          status: "done",
          operation: "remove_background",
          params: null,
          errorMessage: null,
          createdAt: new Date("2026-10-01"),
          completedAt: new Date("2026-10-01"),
        },
      ];

      const selectChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(dbJobs),
      };

      const countChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain as never)
        .mockReturnValueOnce(countChain as never);

      const req = {
        user: { userId: "user-123" },
        query: { limit: 10, offset: 0 },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      await sut.list(req, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        jobs: expectedJobs,
        total: 1,
      });
    });
  });

  describe("delete endpoint", () => {
    it("should return 404 when job does not exist or does not belong to user", async () => {
      const selectChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.select).mockReturnValueOnce(selectChain as never);

      const req = {
        user: { userId: "user-123" },
        params: { id: "job-999" },
        log: { error: vi.fn(), warn: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      await sut.delete(req, reply);

      expect(reply.status).toHaveBeenCalledWith(404);
      expect(reply.send).toHaveBeenCalledWith({ error: "Job not found" });
    });

    it("should delete storage files and database row when job exists", async () => {
      const existingJob = {
        id: "job-1",
        userId: "user-123",
        originalKey: "uploads/job-1.png",
        resultKey: "results/job-1.png",
      };

      const selectChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([existingJob]),
      };
      vi.mocked(db.select).mockReturnValueOnce(selectChain as never);

      const deleteChain = {
        where: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(db.delete).mockReturnValueOnce(deleteChain as never);

      const req = {
        user: { userId: "user-123" },
        params: { id: "job-1" },
        log: { error: vi.fn(), warn: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      await sut.delete(req, reply);

      expect(storage.delete).toHaveBeenCalledWith("uploads/job-1.png");
      expect(storage.delete).toHaveBeenCalledWith("results/job-1.png");
      expect(db.delete).toHaveBeenCalled();
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        success: true,
        jobId: "job-1",
      });
    });
  });
});
