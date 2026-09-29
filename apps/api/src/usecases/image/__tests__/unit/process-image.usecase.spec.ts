import { describe, it, vi, expect, beforeEach } from "vitest";
import { ProcessImageUseCase } from "../../process-image.usecase";
import { storage } from "@/lib/storage";
import { queue, QUEUES } from "@/lib/queue";
import { db } from "@/database";

vi.mock("@/lib/storage", () => ({
  storage: {
    upload: vi.fn().mockResolvedValue("uploads/key.png"),
    download: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/queue", () => ({
  QUEUES: {
    IMAGE_PROCESSING: "image-processing",
    IMAGE_RESULTS: "image-results",
  },
  queue: {
    publish: vi.fn().mockResolvedValue(true),
    consume: vi.fn(),
  },
}));

vi.mock("@/database", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
  jobs: {},
}));

describe("ProcessImageUseCase unit tests", () => {
  let sut: ProcessImageUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    sut = new ProcessImageUseCase();
  });

  it("should upload image to storage, insert job into db, and publish to queue", async () => {
    // Arrange
    const input = {
      userId: "user-uuid-123",
      fileBuffer: Buffer.from("image_data"),
      filename: "photo.jpg",
      mimetype: "image/jpeg",
      operation: "remove_background",
      params: undefined,
    };

    // Act
    const result = await sut.execute(input);

    // Assert
    expect(result).toHaveProperty("jobId");
    expect(result.status).toBe("pending");
    expect(storage.upload).toHaveBeenCalledWith(
      expect.stringContaining("uploads/"),
      input.fileBuffer,
      input.mimetype,
    );
    expect(db.insert).toHaveBeenCalled();
    expect(queue.publish).toHaveBeenCalledWith(
      QUEUES.IMAGE_PROCESSING,
      expect.objectContaining({
        jobId: result.jobId,
        operation: "remove_background",
      }),
    );
  });

  it("should pass params when provided (e.g. for resize)", async () => {
    // Arrange
    const input = {
      userId: "user-uuid-123",
      fileBuffer: Buffer.from("image_data"),
      filename: "photo.png",
      mimetype: "image/png",
      operation: "resize",
      params: { width: 500, height: 300 },
    };

    // Act
    const result = await sut.execute(input);

    // Assert
    expect(result.jobId).toBeDefined();
    expect(queue.publish).toHaveBeenCalledWith(
      QUEUES.IMAGE_PROCESSING,
      expect.objectContaining({
        params: { width: 500, height: 300 },
      }),
    );
  });
});
