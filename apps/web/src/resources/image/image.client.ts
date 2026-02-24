import type {
  ImageProcessRequest,
  ImageProcessResponse,
} from "@/resources/image/image.types";

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 150000; // 2.5 minutos

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * processImageClient
 * Client-side image processing via API route.
 * Returns a blob Object URL instead of base64 — much lighter on memory and bandwidth.
 */
export async function processImageClient({
  file,
  operation,
  width,
  height,
}: ImageProcessRequest): Promise<ImageProcessResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Tentativa ${attempt + 1}/${MAX_RETRIES + 1}...`);
        await delay(RETRY_DELAY_MS);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("operation", operation);

      if (width) {
        formData.append("width", String(width));
      }
      if (height) {
        formData.append("height", String(height));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      let response: Response;
      try {
        response = await fetch("/api/images/process", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (response.status === 401) {
        return { error: "UNAUTHORIZED" };
      }

      // Erro 503 (servidor ocupado) - pode tentar novamente
      if (response.status === 503 && attempt < MAX_RETRIES) {
        console.log("Servidor ocupado, tentando novamente...");
        continue;
      }

      if (!response.ok) {
        return { error: "PROCESSING_FAILED" };
      }

      // Create an Object URL from the blob — no base64 conversion!
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      return {
        processedImage: objectUrl,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (
        lastError.name === "AbortError" ||
        lastError.message.includes("fetch")
      ) {
        console.error(`Tentativa ${attempt + 1} falhou:`, lastError.message);
        if (attempt < MAX_RETRIES) {
          continue;
        }
      }

      console.error("Erro ao processar imagem:", lastError);
      return { error: "UNKNOWN" };
    }
  }

  console.error("Todas as tentativas falharam:", lastError?.message);
  return { error: "PROCESSING_FAILED" };
}
