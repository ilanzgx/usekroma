import type { JobDTO, JobStatus, ListJobsQuery, ListJobsResponse } from "@kroma/shared";

export type { JobDTO, JobStatus, ListJobsQuery, ListJobsResponse };

export type GalleryFilter = "all" | "done" | "processing" | "failed";

export type GalleryViewMode = "grid" | "list";

export type GalleryState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "success"; readonly jobs: readonly JobDTO[]; readonly total: number };
