"use client";

import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Wand2,
  Focus,
  Palette,
  Crop,
  CircleDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageProcessOperations } from "@/resources/image/image.types";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  operation: ImageProcessOperations;
}

export const TOOLS: Tool[] = [
  {
    id: "remove-background",
    name: "Remove Background",
    description: "Remove the background from your images.",
    icon: Wand2,
    color: "text-purple-500",
    operation: "remove_background",
  },
  {
    id: "sharpen",
    name: "Sharpen",
    description: "Sharpen your images.",
    icon: Focus,
    color: "text-yellow-500",
    operation: "sharpen",
  },
  {
    id: "grayscale",
    name: "Black and White",
    description: "Convert your images to black and white.",
    icon: Palette,
    color: "text-gray-500",
    operation: "grayscale",
  },
  {
    id: "crop",
    name: "Crop image",
    description: "Crop your images.",
    icon: Crop,
    color: "text-green-500",
    operation: "crop",
  },
  {
    id: "blur",
    name: "Blur",
    description: "Blur your images.",
    icon: CircleDashed,
    color: "text-blue-500",
    operation: "blur",
  },
];

interface ToolsSectionProps {
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
}

export default function ToolsSection({
  selectedTool,
  onSelectTool,
}: ToolsSectionProps) {
  return (
    <div className="border rounded-md p-4">
      <h2 className="text-xl font-bold mb-4">Tools library</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {TOOLS.map((tool) => {
          const isSelected = selectedTool.id === tool.id;
          return (
            <Button
              key={tool.id}
              variant="ghost"
              onClick={() => onSelectTool(tool)}
              className={cn(
                "group h-auto py-2 justify-start text-left transition-all",
                isSelected && "bg-gray-100 hover:bg-gray-100",
              )}
            >
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
            </Button>
          );
        })}
      </div>
    </div>
  );
}
