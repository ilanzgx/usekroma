"use client";

import { cn } from "@/lib/utils";
import { RESIZES } from "@/lib/resizes";
import Link from "next/link";

export default function ResizeSection() {
  return (
    <div className="border rounded-md p-4">
      <h1 className="text-xl font-bold mb-4">Redimensionar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
        {RESIZES.map((resize) => (
          <Link
            key={resize.id}
            href={`/studio/resize/${resize.slugs[1] || resize.slugs[0]}`}
            className="group flex flex-col items-center gap-1 px-3 py-3 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <resize.icon
              className={cn(
                "size-5 transition-transform duration-200 group-hover:scale-110",
                resize.color,
              )}
            />
            <span className="text-sm font-semibold">{resize.aspectRatio}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
