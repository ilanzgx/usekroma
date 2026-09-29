import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { ImageController } from "@/controllers/image.controller";
import { ProcessImageUseCase } from "@/usecases/image/process-image.usecase";
import { FastifyReply, FastifyRequest } from "fastify";

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

const createMultipartFile = (overrides = {}) => ({
  filename: "photo.jpg",
  mimetype: "image/jpeg",
  toBuffer: vi.fn().mockResolvedValue(Buffer.from("fake_image")),
  fields: {
    operation: {
      value: "upscale",
    },
  },
  ...overrides,
});

describe("ImageController unit tests", () => {
  let sut: ImageController;
  let mockProcessImageUseCase: Mocked<ProcessImageUseCase>;

  beforeEach(() => {
    mockProcessImageUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<ProcessImageUseCase>;

    sut = new ImageController(mockProcessImageUseCase);
  });

  describe("uploadImage endpoint", () => {
    it("should return 400 when no file is uploaded", async () => {
      // Arrange
      const req = {
        file: vi.fn().mockResolvedValue(undefined),
        user: { userId: "user-123" },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({ error: "No file uploaded" });
      expect(mockProcessImageUseCase.execute).not.toHaveBeenCalled();
    });

    it("should enqueue image and return 202 with jobId", async () => {
      // Arrange
      const mockResult = { jobId: "job-123", status: "pending" as const };
      mockProcessImageUseCase.execute.mockResolvedValue(mockResult);

      const file = createMultipartFile();
      const req = {
        file: vi.fn().mockResolvedValue(file),
        user: { userId: "user-123" },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(mockProcessImageUseCase.execute).toHaveBeenCalledWith({
        userId: "user-123",
        fileBuffer: Buffer.from("fake_image"),
        filename: "photo.jpg",
        mimetype: "image/jpeg",
        operation: "upscale",
        params: undefined,
      });
      expect(reply.status).toHaveBeenCalledWith(202);
      expect(reply.send).toHaveBeenCalledWith(mockResult);
    });

    it("should use 'upscale' as default when operation field is absent", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockResolvedValue({
        jobId: "job-123",
        status: "pending",
      });

      const file = createMultipartFile({ fields: {} });
      const req = {
        file: vi.fn().mockResolvedValue(file),
        user: { userId: "user-123" },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(mockProcessImageUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: "upscale",
        }),
      );
    });

    it("should pass width and height params when provided", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockResolvedValue({
        jobId: "job-123",
        status: "pending",
      });

      const file = createMultipartFile({
        fields: {
          operation: { value: "resize" },
          width: { value: "800" },
          height: { value: "600" },
        },
      });
      const req = {
        file: vi.fn().mockResolvedValue(file),
        user: { userId: "user-123" },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(mockProcessImageUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: "resize",
          params: { width: 800, height: 600 },
        }),
      );
    });

    it("should return 500 with error message when use case throws", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockRejectedValue(
        new Error("Queue error"),
      );

      const req = {
        file: vi.fn().mockResolvedValue(createMultipartFile()),
        user: { userId: "user-123" },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: "Failed to enqueue image processing",
        message: "Queue error",
      });
    });

    it("should return 'Unknown error' message when error is not an Error instance", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockRejectedValue("string error");

      const req = {
        file: vi.fn().mockResolvedValue(createMultipartFile()),
        user: { userId: "user-123" },
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(reply.send).toHaveBeenCalledWith({
        error: "Failed to enqueue image processing",
        message: "Unknown error",
      });
    });

    it("should log the error when use case throws", async () => {
      // Arrange
      const error = new Error("Queue error");
      mockProcessImageUseCase.execute.mockRejectedValue(error);

      const mockLog = { error: vi.fn() };
      const req = {
        file: vi.fn().mockResolvedValue(createMultipartFile()),
        user: { userId: "user-123" },
        log: mockLog,
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(mockLog.error).toHaveBeenCalledWith(error);
    });
  });
});
