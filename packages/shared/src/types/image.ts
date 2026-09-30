export type ImageProcessOperations =
  | "sharpen"
  | "blur"
  | "upscale"
  | "remove_background"
  | "ai_upscale"
  | "grayscale"
  | "sepia"
  | "vignette"
  | "flip_horizontal"
  | "flip_vertical"
  | "saturate"
  | "cartoon"
  | "pencil_sketch"
  | "oil_painting"
  | "resize";

export interface ImageProcessRequest {
  file: File;
  operation: ImageProcessOperations;
  width?: number;
  height?: number;
}

export interface ImageProcessResponse {
  processedImage?: string;
  error?: "UNAUTHORIZED" | "PROCESSING_FAILED" | "TIMEOUT" | "UNKNOWN";
  message?: string | null;
}

export interface ResizeParams {
  width: number;
  height: number;
}
