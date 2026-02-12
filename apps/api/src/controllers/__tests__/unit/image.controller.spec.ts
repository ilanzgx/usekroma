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

    it("should process image and return 200 with correct headers", async () => {
      // Arrange
      const processedBuffer = Buffer.from("processed-image");
      mockProcessImageUseCase.execute.mockResolvedValue(processedBuffer);

      const file = createMultipartFile();
      const req = {
        file: vi.fn().mockResolvedValue(file),
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(mockProcessImageUseCase.execute).toHaveBeenCalledWith(
        Buffer.from("fake_image"),
        "photo.jpg",
        "upscale",
      );
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.header).toHaveBeenCalledWith("Content-Type", "image/png");
      expect(reply.header).toHaveBeenCalledWith(
        "Content-Disposition",
        `attachment; filename="processed.png"`,
      );
      expect(reply.send).toHaveBeenCalledWith(processedBuffer);
    });

    it("should use 'upscale' as default when operation field is absent", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockResolvedValue(Buffer.from("result"));

      const file = createMultipartFile({ fields: {} }); // no operation field
      const req = {
        file: vi.fn().mockResolvedValue(file),
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(mockProcessImageUseCase.execute).toHaveBeenCalledWith(
        expect.any(Buffer),
        expect.any(String),
        "upscale", // fallback
      );
    });

    it("should return 500 with error message when use case throws", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockRejectedValue(
        new Error("Worker timeout"),
      );

      const req = {
        file: vi.fn().mockResolvedValue(createMultipartFile()),
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: "Failed to process image",
        message: "Worker timeout",
      });
    });

    it("should return 'Unknown error' message when error is not an Error instance", async () => {
      // Arrange
      mockProcessImageUseCase.execute.mockRejectedValue("string error");

      const req = {
        file: vi.fn().mockResolvedValue(createMultipartFile()),
        log: { error: vi.fn() },
      } as unknown as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.uploadImage(req, reply);

      // Assert
      expect(reply.send).toHaveBeenCalledWith({
        error: "Failed to process image",
        message: "Unknown error",
      });
    });

    it("should log the error when use case throws", async () => {
      // Arrange
      const error = new Error("Worker timeout");
      mockProcessImageUseCase.execute.mockRejectedValue(error);

      const mockLog = { error: vi.fn() };
      const req = {
        file: vi.fn().mockResolvedValue(createMultipartFile()),
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
