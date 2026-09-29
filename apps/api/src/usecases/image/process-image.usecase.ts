import { randomUUID } from "node:crypto";
import path from "node:path";
import { storage } from "@/lib/storage";
import { queue, QUEUES } from "@/lib/queue";
import { db, jobs } from "@/database";

export interface ProcessImageInput {
  userId: string;
  fileBuffer: Buffer;
  filename: string;
  mimetype: string;
  operation: string;
  params?: { width?: number; height?: number };
}

export interface ProcessImageOutput {
  jobId: string;
  status: "pending";
}

export class ProcessImageUseCase {
  async execute(input: ProcessImageInput): Promise<ProcessImageOutput> {
    const jobId = randomUUID();
    const ext = path.extname(input.filename) || ".png";
    const imageKey = `uploads/${jobId}${ext}`;

    await storage.upload(imageKey, input.fileBuffer, input.mimetype);

    await db.insert(jobs).values({
      id: jobId,
      userId: input.userId,
      status: "pending",
      operation: input.operation,
      params: input.params,
      originalKey: imageKey,
    });

    await queue.publish(QUEUES.IMAGE_PROCESSING, {
      jobId,
      imageKey,
      operation: input.operation,
      params: input.params,
    });

    return {
      jobId,
      status: "pending",
    };
  }
}
