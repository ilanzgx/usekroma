import { apiFetch } from "@/lib/api-client";
import type { ListJobsQuery, ListJobsResponse } from "./job.types";

export async function fetchJobsClient(query?: ListJobsQuery): Promise<ListJobsResponse> {
  const params = new URLSearchParams();

  if (query?.status) {
    params.set("status", query.status);
  }
  if (query?.operation) {
    params.set("operation", query.operation);
  }
  if (query?.limit !== undefined) {
    params.set("limit", String(query.limit));
  }
  if (query?.offset !== undefined) {
    params.set("offset", String(query.offset));
  }

  // Cache-busting timestamp para garantir dados sempre atualizados
  params.set("_t", String(Date.now()));

  const queryString = params.toString();
  const url = `/api/jobs?${queryString}`;

  const response = await apiFetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error(`Falha ao buscar imagens: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteJobClient(jobId: string): Promise<boolean> {
  const response = await apiFetch(`/api/jobs/${jobId}`, {
    method: "DELETE",
  });

  return response.ok;
}

export async function downloadJobImageClient(jobId: string, filename?: string): Promise<void> {
  const response = await apiFetch(`/api/jobs/${jobId}/result`);
  if (!response.ok) {
    throw new Error("Não foi possível baixar o arquivo da imagem.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename || `kroma-${jobId}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}
