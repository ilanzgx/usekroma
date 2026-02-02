export type ImageProcessOperations =
  | "upscale"
  | "remove_background"
  | "blur"
  | "sharpen"
  | "grayscale"
  | "crop";

export interface ImageProcessRequest {
  file: File;
  operation: ImageProcessOperations;
}

export interface ImageProcessResponse {
  processedImage?: string;
  error?: "UNAUTHORIZED" | "PROCESSING_FAILED" | "UNKNOWN";
}
