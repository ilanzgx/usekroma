"use client";

import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Download, X } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function EditorSection() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Simulate processing
      setTimeout(() => {
        setProcessedUrl(url);
      }, 1500);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleClear = () => {
    setPreviewUrl(null);
    setProcessedUrl(null);
    setFileName("");
  };

  return (
    <div className="flex-1 p-6 border rounded-md mt-4">
      <h2 className="text-xl font-bold">Image Editor</h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Selected tool: Remove Background
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(50vh-100px)]">
        {/* Upload Area - Left Side */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Upload Image</h3>
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
                  {isDragActive ? "Drop here!" : "Drop your image here"}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  or click to browse
                </p>
                <Button size="sm">
                  <ImageIcon className="mr-2 size-4" />
                  Select Image
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  PNG, JPG, WebP (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area - Right Side */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Processed Result</h3>
          <div className="flex-1 border-2 border-gray-300 rounded-lg bg-gray-50">
            {processedUrl ? (
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
                    ✓ Processing complete
                  </p>
                  <Button size="sm">
                    <Download className="mr-2 size-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="size-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <ImageIcon className="size-8 text-gray-400" />
                </div>
                <h4 className="text-base font-semibold mb-1">No image yet</h4>
                <p className="text-sm text-muted-foreground">
                  Upload an image to see the result
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
