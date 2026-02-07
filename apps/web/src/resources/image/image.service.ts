"use server";

import { getToken } from "@/resources/auth/auth.service";
import {
  ImageProcessRequest,
  ImageProcessResponse,
} from "@/resources/image/image.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const REQUEST_TIMEOUT_MS = 90000;
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Faz uma requisição com timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * processImageService
 * process image with API
 * @export
 * @param {ImageProcessRequest} { file, operation }
 * @return {*}  {Promise<ImageProcessResponse>}
 */
export async function processImageService({
  file,
  operation,
}: ImageProcessRequest): Promise<ImageProcessResponse> {
  const token = await getToken();

  if (!token) {
    return { error: "UNAUTHORIZED" };
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Aguarda antes de retry (exceto na primeira tentativa)
      if (attempt > 0) {
        console.log(`Tentativa ${attempt + 1}/${MAX_RETRIES + 1}...`);
        await delay(RETRY_DELAY_MS);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("operation", operation);

      const response = await fetchWithTimeout(
        `${BASE_URL}/images/process`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        REQUEST_TIMEOUT_MS,
      );

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

      // Converte para base64
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = blob.type || "image/png";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return {
        processedImage: dataUrl,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Erro de abort (timeout) ou de rede - pode tentar novamente
      if (
        lastError.name === "AbortError" ||
        lastError.message.includes("fetch")
      ) {
        console.error(`Tentativa ${attempt + 1} falhou:`, lastError.message);
        if (attempt < MAX_RETRIES) {
          continue;
        }
      }

      // Outros erros - não tenta novamente
      console.error("Erro ao processar imagem:", lastError);
      return { error: "UNKNOWN" };
    }
  }

  console.error("Todas as tentativas falharam:", lastError?.message);
  return { error: "PROCESSING_FAILED" };
}
