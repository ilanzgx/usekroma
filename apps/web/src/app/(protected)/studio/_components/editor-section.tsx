"use client";

import { Button } from "@/components/ui/button";
import {
  Upload,
  Image as ImageIcon,
  Download,
  X,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { processImageClient } from "@/resources/image/image.client";
import { getToolBySlug } from "@/lib/tools";
import { Scaling } from "lucide-react";
import type { ImageProcessOperations } from "@/resources/image";
import { notFound } from "next/navigation";

interface EditorSectionProps {
  toolId: string;
  resizeRatio?: string;
}

interface ImageDetails {
  width: number;
  height: number;
  size: number;
  type: string;
  aspectRatio: string;
}

type ProcessingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "finishing"
  | "done"
  | "error";

const PROCESSING_MESSAGES: Record<
  ProcessingStatus,
  { title: string; description: string }
> = {
  idle: { title: "", description: "" },
  uploading: {
    title: "Enviando imagem...",
    description: "Preparando para processamento",
  },
  processing: {
    title: "Processando...",
    description: "Isso pode levar alguns segundos",
  },
  finishing: { title: "Finalizando...", description: "Quase lá!" },
  done: { title: "Concluído!", description: "Sua imagem está pronta" },
  error: { title: "Erro", description: "Algo deu errado" },
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

function ImageDetailsPanel({
  details,
  processingTime,
}: {
  details: ImageDetails | null;
  processingTime?: number;
}) {
  if (!details) return null;

  return (
    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
      <span>
        {details.width}x{details.height}
      </span>
      <span>•</span>
      <span>{formatFileSize(details.size)}</span>
      <span>•</span>
      <span>{details.type.split("/")[1]?.toUpperCase()}</span>
      {processingTime !== undefined && (
        <>
          <span>•</span>
          <span>{processingTime}s</span>
        </>
      )}
    </div>
  );
}

export default function EditorSection({
  toolId,
  resizeRatio,
}: EditorSectionProps) {
  const tool = getToolBySlug(toolId);

  // Resize mode: no tool lookup needed
  const isResizeMode = !!resizeRatio;

  if (!tool && !isResizeMode) {
    notFound();
  }

  const operation: ImageProcessOperations = isResizeMode
    ? "resize"
    : tool!.operation;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatus>("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedTimeRef = useRef(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [inputDetails, setInputDetails] = useState<ImageDetails | null>(null);
  const [outputDetails, setOutputDetails] = useState<ImageDetails | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isProcessing) {
      setElapsedTime(0);
      elapsedTimeRef.current = 0;
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          elapsedTimeRef.current = prev + 1;
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isProcessing]);

  const extractImageDetails = useCallback(
    (file: File): Promise<ImageDetails> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: file.size,
            type: file.type,
            aspectRatio: calculateAspectRatio(
              img.naturalWidth,
              img.naturalHeight,
            ),
          });
        };
        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  const extractOutputDetails = useCallback(
    async (objectUrl: string): Promise<ImageDetails> => {
      // Fetch real blob size from Object URL
      const blobResponse = await fetch(objectUrl);
      const blob = await blobResponse.blob();

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
            size: blob.size,
            type: blob.type || "image/png",
            aspectRatio: calculateAspectRatio(
              img.naturalWidth,
              img.naturalHeight,
            ),
          });
        };
        img.src = objectUrl;
      });
    },
    [],
  );

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setProcessedUrl(null);
      setError(null);
      setQueuePosition(null);
      setProcessingStatus("uploading");
      setElapsedTime(0);
      setFinalTime(null);
      setOutputDetails(null);

      try {
        setProcessingStatus("processing");

        let resizeWidth: number | undefined;
        let resizeHeight: number | undefined;

        if (isResizeMode && resizeRatio) {
          const [rw, rh] = resizeRatio.split(":").map(Number);
          if (rw && rh) {
            const dims = await new Promise<{ width: number; height: number }>(
              (resolve) => {
                const img = new Image();
                img.onload = () =>
                  resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  });
                img.src = URL.createObjectURL(file);
              },
            );
            const targetRatio = rw / rh;
            const origRatio = dims.width / dims.height;
            if (targetRatio > origRatio) {
              resizeWidth = Math.round(dims.height * targetRatio);
              resizeHeight = dims.height;
            } else {
              resizeWidth = dims.width;
              resizeHeight = Math.round(dims.width / targetRatio);
            }
          }
        }

        const result = await processImageClient({
          file,
          operation,
          width: resizeWidth,
          height: resizeHeight,
          onQueuePositionChange: setQueuePosition,
        });

        if (result.error) {
          setProcessingStatus("error");
          if (result.message) {
            setError(result.message);
          } else if (result.error === "PROCESSING_FAILED") {
            setError(
              "Falha ao processar a imagem. O servidor pode estar ocupado. Tente novamente.",
            );
          } else if (result.error === "TIMEOUT") {
            setError(
              "O processamento demorou mais que o esperado. Tente novamente.",
            );
          } else {
            setError("Ocorreu um erro ao processar a imagem.");
          }
          return;
        }

        if (result.processedImage) {
          setProcessingStatus("finishing");
          setProcessedUrl(result.processedImage);
          setProcessingStatus("done");
          setFinalTime(elapsedTimeRef.current);

          // Extract output image details
          const outDetails = await extractOutputDetails(result.processedImage);
          setOutputDetails(outDetails);
        }
      } catch (err) {
        setProcessingStatus("error");
        setError("Ocorreu um erro inesperado. Tente novamente.");
        console.error("Processing error:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [operation, extractOutputDetails, isResizeMode, resizeRatio],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setFileName(file.name);
        setError(null);

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Extract input image details
        const details = await extractImageDetails(file);
        setInputDetails(details);

        await processImage(file);
      }
    },
    [processImage, extractImageDetails],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors?.some((e) => e.code === "file-too-large")) {
        setError("Arquivo muito grande. O tamanho máximo é 5MB.");
      } else {
        setError("Arquivo inválido. Por favor, envie uma imagem válida.");
      }
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleClear = () => {
    // Revoke Object URLs to free memory
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);

    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setFileName("");
    setError(null);
    setIsProcessing(false);
    setProcessingStatus("idle");
    setElapsedTime(0);
    setInputDetails(null);
    setOutputDetails(null);
  };

  const ToolIcon = isResizeMode ? Scaling : tool!.icon;
  const toolColor = isResizeMode ? "text-blue-500" : tool!.color;
  const toolName = isResizeMode ? `Redimensionar (${resizeRatio})` : tool!.name;

  return (
    <div className="flex-1 p-6 border rounded-md mt-4">
      <h2 className="text-xl font-bold">Editor</h2>

      <div className="mb-6 flex items-center gap-2">
        <ToolIcon className={`size-4 ${toolColor}`} />
        <p className="text-sm text-muted-foreground">
          Ferramenta selecionada:{" "}
          <span className="font-medium text-foreground">{toolName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(70vh-100px)]">
        {/* Upload Area - Left Side */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Selecione uma imagem</h3>
          <div
            {...getRootProps()}
            className={`flex-1 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <div className="h-full p-4 flex flex-col min-h-0">
                <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-100 min-h-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="absolute top-2 right-2 size-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground truncate shrink-0">
                  {fileName}
                </p>
                <ImageDetailsPanel details={inputDetails} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Upload className="size-8 text-gray-400" />
                </div>
                <h4 className="text-base font-semibold mb-1">
                  {isDragActive
                    ? "Solte aqui!"
                    : "Arraste e solte sua imagem aqui"}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  ou clique para selecionar
                </p>
                <Button size="sm">
                  <ImageIcon className="mr-2 size-4" />
                  Selecionar Imagem
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  PNG, JPG, WebP (máx 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area - Right Side */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Resultado</h3>
          <div className="flex-1 border-2 border-gray-300 rounded-lg bg-gray-50">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                {/* Ícone dinâmico baseado no status */}
                <div className="relative mb-4">
                  {processingStatus === "uploading" ? (
                    <Upload className="size-12 text-primary animate-pulse" />
                  ) : processingStatus === "finishing" ? (
                    <Sparkles className="size-12 text-emerald-500 animate-pulse" />
                  ) : (
                    <Loader2 className="size-12 text-primary animate-spin" />
                  )}
                </div>

                {/* Título e descrição dinâmicos com suporte a posição na fila */}
                <h4 className="text-base font-semibold mb-1">
                  {processingStatus === "processing" && queuePosition !== null && queuePosition > 1
                    ? "Aguardando na fila..."
                    : PROCESSING_MESSAGES[processingStatus].title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {processingStatus === "processing" && queuePosition !== null && queuePosition > 1
                    ? `Posição #${queuePosition} na fila de espera`
                    : processingStatus === "processing"
                      ? `Executando ${toolName} com IA...`
                      : PROCESSING_MESSAGES[processingStatus].description}
                </p>

                {/* Tempo decorrido */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{elapsedTime}s</span>
                </div>

                {/* Barra de progresso animada */}
                <div className="w-48 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full animate-pulse"
                    style={{
                      width:
                        processingStatus === "uploading"
                          ? "30%"
                          : processingStatus === "processing"
                            ? "60%"
                            : processingStatus === "finishing"
                              ? "90%"
                              : "100%",
                      transition: "width 0.5s ease-out",
                    }}
                  />
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <X className="size-8 text-red-500" />
                </div>
                <h4 className="text-base font-semibold mb-1 text-red-600">
                  Erro
                </h4>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => selectedFile && onDrop([selectedFile])}
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : processedUrl ? (
              <div className="h-full p-4 flex flex-col min-h-0">
                <div className="flex-1 relative rounded-lg overflow-hidden bg-white border min-h-0">
                  <img
                    src={processedUrl}
                    alt="Processed"
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                </div>
                <div className="mt-3 flex justify-between items-center shrink-0">
                  <p className="text-sm text-muted-foreground">
                    ✓ Processamento concluído
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = processedUrl;
                      // Remove extensão original e adiciona .png
                      const baseName = fileName.replace(/\.[^/.]+$/, "");
                      link.download = `processed_${baseName}.png`;
                      link.click();
                    }}
                  >
                    <Download className="mr-2 size-4" />
                    Baixar
                  </Button>
                </div>
                <ImageDetailsPanel
                  details={outputDetails}
                  processingTime={finalTime ?? undefined}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="size-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <ImageIcon className="size-8 text-gray-400" />
                </div>
                <h4 className="text-base font-semibold mb-1">
                  Nenhuma imagem ainda
                </h4>
                <p className="text-sm text-muted-foreground">
                  Faça upload de uma imagem para ver o resultado
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
