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
  params?: JobParams | null;
  queuePosition?: number | null;
  errorMessage?: string | null;
  createdAt: Date | string;
  completedAt?: Date | string | null;
}

export interface CreateJobResponse {
  jobId: string;
  status: "pending";
}

export interface ListJobsQuery {
  status?: JobStatus;
  operation?: string;
  limit?: number;
  offset?: number;
}

export interface ListJobsResponse {
  jobs: JobDTO[];
  total: number;
}

export interface DeleteJobResponse {
  success: boolean;
  jobId: string;
}
