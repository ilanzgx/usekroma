"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TOOLS } from "@/lib/tools";
import Link from "next/link";

export default function ToolsSection() {
  return (
    <div className="border rounded-md p-4">
      <h1 className="text-xl font-bold mb-4">Tools Library</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {TOOLS.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            asChild
            className="group h-auto py-2 justify-start text-left transition-all hover:bg-gray-100"
          >
            <Link href={`/studio/${tool.id}`}>
              <div className="flex items-center">
                <div className="border rounded-md p-3 transition-colors">
                  <tool.icon
                    className={cn(
                      "size-5 transition-transform duration-200 group-hover:scale-110",
                      tool.color,
                    )}
                  />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-semibold">{tool.name}</p>
                  <p className="text-xs text-muted-foreground whitespace-normal">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
