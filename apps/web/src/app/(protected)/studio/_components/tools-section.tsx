"use client";

import { cn } from "@/lib/utils";
import { TOOLS } from "@/lib/tools";
import Link from "next/link";

export default function ToolsSection() {
  return (
    <div className="border rounded-md p-4">
      <h1 className="text-xl font-bold mb-4">Ferramentas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={`/studio/${tool.slugs[1] || tool.slugs[0]}`}
            className="group flex flex-col items-center gap-1 px-3 py-3 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <tool.icon
              className={cn(
                "size-5 transition-transform duration-200 group-hover:scale-110",
                tool.color
              )}
            />
            <span className="text-sm font-semibold text-center">
              {tool.name}
            </span>
            <span className="text-xs text-muted-foreground text-center">
              {tool.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
