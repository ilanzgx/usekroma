"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ImageIcon,
  RefreshCw,
  Download,
  Trash2,
  Maximize2,
  AlertCircle,
  Loader2,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TOOLS } from "@/lib/tools";
import {
  fetchJobsClient,
  deleteJobClient,
  downloadJobImageClient,
  type JobDTO,
  type GalleryFilter,
  type GalleryViewMode,
} from "@/resources/job";

function getToolName(operation: string): string {
  const tool = TOOLS.find((t) => t.operation === operation);
  if (tool) return tool.name;
  if (operation === "resize") return "Redimensionar";
  return operation;
}

function formatDate(dateValue: Date | string): string {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ImagesPage() {
  const [jobs, setJobs] = useState<JobDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<GalleryFilter>("all");
  const [operationFilter, setOperationFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<GalleryViewMode>("grid");

  const [jobToDelete, setJobToDelete] = useState<JobDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewJob, setPreviewJob] = useState<JobDTO | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadJobs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetchJobsClient({ limit: 100 });
      setJobs(response.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as imagens.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const response = await fetchJobsClient({ limit: 100 });
        if (!ignore) {
          setJobs(response.jobs);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar as imagens.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    void init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);

    try {
      const success = await deleteJobClient(jobToDelete.id);
      if (success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
        setJobToDelete(null);
      }
    } catch {
      // Ignora erro e fecha
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (job: JobDTO) => {
    if (job.status !== "done") return;
    setDownloadingId(job.id);
    try {
      await downloadJobImageClient(job.id, `kroma-${job.operation}-${job.id.slice(0, 8)}.png`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Auto-polling em segundo plano enquanto houver jobs na fila ou processando
  useEffect(() => {
    const hasActiveJobs = jobs.some((j) => j.status === "pending" || j.status === "processing");

    if (!hasActiveJobs) return;

    const timer = setInterval(() => {
      loadJobs(true);
    }, 2000);

    return () => clearInterval(timer);
  }, [jobs, loadJobs]);

  const hasActiveJobs = jobs.some((j) => j.status === "pending" || j.status === "processing");

  const effectiveStatusFilter: GalleryFilter =
    statusFilter === "processing" && !hasActiveJobs ? "all" : statusFilter;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        effectiveStatusFilter === "all"
          ? true
          : effectiveStatusFilter === "processing"
            ? job.status === "pending" || job.status === "processing"
            : job.status === effectiveStatusFilter;
      const matchesOperation = operationFilter === "all" ? true : job.operation === operationFilter;
      return matchesStatus && matchesOperation;
    });
  }, [jobs, effectiveStatusFilter, operationFilter]);

  const uniqueOperations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.operation)));
  }, [jobs]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header simples e direto */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#09090B]">Imagens</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Histórico das transformações realizadas.</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadJobs(true)}
          disabled={isLoading || isRefreshing}
          className="h-8 text-xs border-zinc-200 hover:bg-zinc-50 gap-1.5"
        >
          <RefreshCw className={`size-3 text-zinc-500 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Atualizar</span>
        </Button>
      </div>

      {/* Barra de filtros minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            Todas ({jobs.length})
          </button>
          <button
            onClick={() => setStatusFilter("done")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === "done"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            Concluídas ({jobs.filter((j) => j.status === "done").length})
          </button>
          {jobs.some((j) => j.status === "pending" || j.status === "processing") && (
            <button
              onClick={() => setStatusFilter("processing")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === "processing"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              Processando (
              {jobs.filter((j) => j.status === "pending" || j.status === "processing").length})
            </button>
          )}
          {jobs.some((j) => j.status === "failed") && (
            <button
              onClick={() => setStatusFilter("failed")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === "failed"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              Falhas
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {uniqueOperations.length > 1 && (
            <select
              value={operationFilter}
              onChange={(e) => setOperationFilter(e.target.value)}
              className="h-8 px-2.5 text-xs bg-white border border-zinc-200 rounded-md text-zinc-700 outline-none hover:border-zinc-300"
            >
              <option value="all">Todas as ferramentas</option>
              {uniqueOperations.map((op) => (
                <option key={op} value={op}>
                  {getToolName(op)}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center border border-zinc-200 rounded-md bg-white p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-sm transition-colors ${
                viewMode === "grid"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
              title="Grade"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-sm transition-colors ${
                viewMode === "list"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
              title="Lista"
            >
              <ListIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-zinc-200 rounded-lg p-2.5 space-y-2 bg-white">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-zinc-200 rounded-lg bg-white space-y-2">
          <p className="text-xs text-zinc-500">{error}</p>
          <Button variant="outline" size="sm" onClick={() => loadJobs()} className="text-xs">
            Tentar de novo
          </Button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-200 rounded-lg bg-white space-y-3">
          <ImageIcon className="size-8 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-800">Nenhuma imagem encontrada</p>
            <p className="text-xs text-zinc-400">
              {jobs.length === 0
                ? "Processe sua primeira foto no estúdio para vê-la aqui."
                : "Nenhum arquivo corresponde ao filtro selecionado."}
            </p>
          </div>
          {jobs.length === 0 && (
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
            >
              <span>Abrir estúdio</span>
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Visualização em Grade Minimalista */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredJobs.map((job) => {
            const toolName = getToolName(job.operation);

            return (
              <div
                key={job.id}
                className="group relative border border-zinc-200 rounded-lg overflow-hidden bg-white hover:border-zinc-300 transition-colors flex flex-col justify-between"
              >
                {/* Imagem */}
                <div className="relative aspect-square bg-zinc-50 flex items-center justify-center overflow-hidden">
                  {job.status === "done" ? (
                    <>
                      <img
                        src={`/api/jobs/${job.id}/result`}
                        alt={toolName}
                        loading="lazy"
                        className="size-full object-contain p-2"
                      />
                      <button
                        onClick={() => setPreviewJob(job)}
                        className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        title="Expandir"
                      >
                        <div className="size-7 rounded-md bg-white shadow-xs flex items-center justify-center text-zinc-700">
                          <Maximize2 className="size-3.5" />
                        </div>
                      </button>
                    </>
                  ) : job.status === "failed" ? (
                    <div className="text-center p-2">
                      <AlertCircle className="size-5 text-zinc-400 mx-auto mb-1" />
                      <span className="text-[11px] text-zinc-500">Falha</span>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <Loader2 className="size-5 text-zinc-400 animate-spin mx-auto mb-1" />
                      <span className="text-[11px] text-zinc-500">Processando</span>
                    </div>
                  )}
                </div>

                {/* Dados da imagem */}
                <div className="p-2.5 flex items-center justify-between border-t border-zinc-100">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-zinc-900 truncate">{toolName}</p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    {job.status === "done" && (
                      <button
                        onClick={() => handleDownload(job)}
                        disabled={downloadingId === job.id}
                        className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded transition-colors cursor-pointer"
                        title="Baixar"
                      >
                        {downloadingId === job.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Download className="size-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setJobToDelete(job)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização em Lista Minimalista */
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
              <tr>
                <th className="py-2 px-3">Prévia</th>
                <th className="py-2 px-3">Ferramenta</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Data</th>
                <th className="py-2 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredJobs.map((job) => {
                const toolName = getToolName(job.operation);

                return (
                  <tr key={job.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-1.5 px-3">
                      <div className="size-8 rounded bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                        {job.status === "done" ? (
                          <img
                            src={`/api/jobs/${job.id}/result`}
                            alt={toolName}
                            loading="lazy"
                            className="size-full object-cover cursor-pointer"
                            onClick={() => setPreviewJob(job)}
                          />
                        ) : (
                          <ImageIcon className="size-3.5 text-zinc-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-3 font-medium text-zinc-900">{toolName}</td>
                    <td className="py-1.5 px-3 text-zinc-500">
                      {job.status === "done"
                        ? "Concluído"
                        : job.status === "failed"
                          ? "Falha"
                          : "Processando"}
                    </td>
                    <td className="py-1.5 px-3 text-zinc-400">{formatDate(job.createdAt)}</td>
                    <td className="py-1.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {job.status === "done" && (
                          <button
                            onClick={() => handleDownload(job)}
                            className="p-1 text-zinc-500 hover:text-zinc-900 rounded"
                            title="Baixar"
                          >
                            <Download className="size-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-1 text-zinc-400 hover:text-rose-600 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Exclusão */}
      <Dialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-zinc-900">
              Excluir imagem?
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              O arquivo será removido do servidor. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJobToDelete(null)}
              disabled={isDeleting}
              className="text-xs h-8 border-zinc-200"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="text-xs h-8"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Prévia */}
      <Dialog open={!!previewJob} onOpenChange={(open) => !open && setPreviewJob(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-4 sm:p-6">
          <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-100 pr-8">
            <div>
              <DialogTitle className="text-sm font-semibold text-zinc-900">
                {previewJob ? getToolName(previewJob.operation) : ""}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                {previewJob ? formatDate(previewJob.createdAt) : ""}
                {previewJob?.params?.width && previewJob?.params?.height && (
                  <span className="ml-2 font-mono">
                    • {previewJob.params.width}x{previewJob.params.height}
                  </span>
                )}
              </DialogDescription>
            </div>

            {previewJob && previewJob.status === "done" && (
              <Button
                size="sm"
                onClick={() => handleDownload(previewJob)}
                className="text-xs h-8 gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 shrink-0"
              >
                <Download className="size-3.5" />
                <span>Baixar</span>
              </Button>
            )}
          </DialogHeader>

          {previewJob && (
            <div className="relative w-full h-[65vh] max-h-140 flex items-center justify-center bg-zinc-50 rounded-lg border border-zinc-100 my-3 p-3 overflow-hidden">
              <img
                src={`/api/jobs/${previewJob.id}/result`}
                alt={previewJob.operation}
                className="w-auto h-auto max-w-full max-h-full object-contain select-none"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
