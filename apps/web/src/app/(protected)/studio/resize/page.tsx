"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { RESIZES } from "@/lib/resizes";
import EditorSection from "../_components/editor-section";

function ResizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ratioParam = searchParams.get("ratio");
  const selectedRatio = ratioParam || "1:1";

  const handleRatioChange = (ratio: string) => {
    router.push(`/studio/resize?ratio=${ratio}`, { scroll: false });
  };

  return (
    <div>
      {/* Ratio selector */}
      <div className="border rounded-md p-4">
        <h2 className="text-lg font-bold mb-3">Proporção</h2>
        <div className="flex flex-wrap gap-2">
          {RESIZES.map((resize) => (
            <button
              key={resize.id}
              onClick={() => handleRatioChange(resize.aspectRatio)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-md border transition-all",
                selectedRatio === resize.aspectRatio
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "hover:bg-gray-50",
              )}
            >
              <resize.icon
                className={cn(
                  "size-4",
                  selectedRatio === resize.aspectRatio
                    ? "text-blue-600"
                    : resize.color,
                )}
              />
              <span className="text-xs font-semibold">
                {resize.aspectRatio}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor same as tools */}
      <EditorSection toolId="resize" resizeRatio={selectedRatio} />
    </div>
  );
}

export default function ResizePage() {
  return (
    <Suspense>
      <ResizePageContent />
    </Suspense>
  );
}
