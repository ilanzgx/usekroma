import type {
  ImageProcessRequest,
  ImageProcessResponse,
  JobDTO,
} from "@/resources/image/image.types";
import { apiFetch } from "@/lib/api-client";

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;
const POLL_INTERVAL_MS = 1500;
const MAX_POLL_TIME_MS = 15 * 60 * 1000; // 15 minutos

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ProcessImageClientOptions extends ImageProcessRequest {
  onQueuePositionChange?: (position: number | null) => void;
}

/**
 * processImageClient
 * Client-side asynchronous image processing via RabbitMQ job queue.
 * Uploads file, polls job status, and returns a Blob Object URL — zero base64 in transport.
 * 401 responses are handled centrally by apiFetch and trigger an automatic redirect to /login.
 */
export async function processImageClient({
  file,
  operation,
  width,
  height,
  onQueuePositionChange,
}: ProcessImageClientOptions): Promise<ImageProcessResponse> {
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

      // 1. Enfileira o job de processamento
      const response = await apiFetch("/api/images/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg: string | undefined;
        try {
          const errData = await response.json();
          errorMsg = errData?.message || errData?.error;
        } catch {
          // Mantém mensagem padrão caso json não seja parseável
        }
        return { error: "PROCESSING_FAILED", message: errorMsg };
      }

      const { jobId } = (await response.json()) as { jobId?: string };

      if (!jobId) {
        return { error: "UNKNOWN" };
      }

      // 2. Polling até o job estar finalizado
      const startTime = Date.now();

      while (Date.now() - startTime < MAX_POLL_TIME_MS) {
        await delay(POLL_INTERVAL_MS);

        const statusResponse = await apiFetch(`/api/jobs/${jobId}`);

        if (!statusResponse.ok) {
          continue;
        }

        const job: JobDTO = await statusResponse.json();

        if (onQueuePositionChange && job.queuePosition !== undefined) {
          onQueuePositionChange(job.queuePosition);
        }

        if (job.status === "failed") {
          console.error("Job de imagem falhou:", job.errorMessage);
          return {
            error: "PROCESSING_FAILED",
            message: job.errorMessage,
          };
        }

        if (job.status === "done") {
          // 3. Baixa o resultado binário diretamente e cria o Object URL
          const resultResponse = await apiFetch(`/api/jobs/${jobId}/result`);

          if (!resultResponse.ok) {
            return { error: "PROCESSING_FAILED" };
          }

          const blob = await resultResponse.blob();
          const objectUrl = URL.createObjectURL(blob);

          return {
            processedImage: objectUrl,
          };
        }
      }

      return {
        error: "TIMEOUT",
        message: "O processamento demorou mais que o esperado. Tente novamente.",
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error("Erro ao processar imagem:", lastError);

      if (attempt < MAX_RETRIES) {
        continue;
      }

      return { error: "UNKNOWN", message: lastError.message };
    }
  }

  console.error("Todas as tentativas falharam:", lastError?.message);
  return {
    error: "PROCESSING_FAILED",
    message: lastError?.message || "O servidor pode estar ocupado. Tente novamente.",
  };
}

