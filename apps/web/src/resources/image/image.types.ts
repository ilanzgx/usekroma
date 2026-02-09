export type ImageProcessOperations =
  | "upscale"
  | "ai_upscale"
  | "remove_background"
  | "blur"
  | "sharpen"
  | "grayscale"
  | "saturate"
  | "flip_horizontal"
  | "flip_vertical"
  | "sepia"
  | "vignette"
  | "cartoon"
  | "pencil_sketch"
  | "oil_painting";

export interface ImageProcessRequest {
  file: File;
  operation: ImageProcessOperations;
}

export interface ImageProcessResponse {
  processedImage?: string;
  error?: "UNAUTHORIZED" | "PROCESSING_FAILED" | "UNKNOWN";
}
