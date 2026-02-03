"use client";

import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Download, X, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { processImageService } from "@/resources/image";
import { getToolBySlug } from "@/lib/tools";
import { notFound } from "next/navigation";

interface EditorSectionProps {
  toolId: string;
}

export default function EditorSection({ toolId }: EditorSectionProps) {
  const tool = getToolBySlug(toolId);
  const router = useRouter();

  if (!tool) {
    notFound();
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setProcessedUrl(null);
      setError(null);

      try {
        const result = await processImageService({
          file,
          operation: tool.operation,
        });

        if (result.error === "UNAUTHORIZED") {
          // Redirect to login when user is not authenticated
          router.push("/login");
          return;
        }

        if (result.error) {
          setError("Falha ao processar a imagem. Por favor, tente novamente.");
          return;
        }

        if (result.processedImage) {
          setProcessedUrl(result.processedImage);
        }
      } catch (err) {
        setError("Ocorreu um erro ao processar a imagem.");
        console.error("Processing error:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [tool.operation, router],
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

        await processImage(file);
      }
    },
    [processImage],
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
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setFileName("");
    setError(null);
    setIsProcessing(false);
  };

  const ToolIcon = tool.icon;

  return (
    <div className="flex-1 p-6 border rounded-md mt-4">
      <h2 className="text-xl font-bold">Editor</h2>

      <div className="mb-6 flex items-center gap-2">
        <ToolIcon className={`size-4 ${tool.color}`} />
        <p className="text-sm text-muted-foreground">
          Ferramenta selecionada:{" "}
          <span className="font-medium text-foreground">{tool.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(50vh-100px)]">
        {/* Upload Area - Left Side */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Carregar Imagem</h3>
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
          <h3 className="text-lg font-semibold mb-3">Resultado Processado</h3>
          <div className="flex-1 border-2 border-gray-300 rounded-lg bg-gray-50">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="size-12 text-primary animate-spin mb-4" />
                <h4 className="text-base font-semibold mb-1">Processando...</h4>
                <p className="text-sm text-muted-foreground">
                  Isso pode levar alguns instantes
                </p>
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
