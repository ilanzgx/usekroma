import type { ImageProcessOperations } from "./image";

export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface JobParams {
  width?: number;
  height?: number;
}

export interface JobDTO {
  id: string;
  status: JobStatus;
  operation: ImageProcessOperations | string;
  errorMessage?: string | null;
  createdAt: Date | string;
  completedAt?: Date | string | null;
}

export interface CreateJobResponse {
  jobId: string;
  status: "pending";
}
