export type ImageProcessOperations =
  | "upscale"
  | "remove_background"
  | "blur"
  | "sharpen";

export interface ImageProcessRequest {
  file: File;
  operation: ImageProcessOperations;
}

export interface ImageProcessResponse {
  processedImage: string;
}
