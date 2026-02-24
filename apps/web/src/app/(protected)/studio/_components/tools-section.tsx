import { cn } from "@/lib/utils";
import { TOOLS } from "@/lib/tools";
import Link from "next/link";
import { Sparkles, Coins } from "lucide-react";

export default function ToolsSection() {
  return (
    <div className="border rounded-md p-4">
      <h1 className="text-xl font-bold mb-4">Ferramentas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={`/studio/${tool.slugs[1] || tool.slugs[0]}`}
            className={cn(
              "group relative flex flex-col items-center gap-1 px-3 py-3 rounded-md transition-all",
              tool.isAI
                ? "bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md"
                : "border hover:bg-gray-50",
            )}
          >
            {tool.isAI && (
              <div className="absolute -top-2 -right-2 bg-linear-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="size-3" />
                IA
              </div>
            )}
            <tool.icon
              className={cn(
                "size-5 transition-transform duration-200 group-hover:scale-110",
                tool.isAI ? "text-purple-600" : tool.color,
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold text-center",
                tool.isAI && "text-purple-900",
              )}
            >
              {tool.name}
            </span>
            <span
              className={cn(
                "text-xs text-center",
                tool.isAI ? "text-purple-600/80" : "text-muted-foreground",
              )}
            >
              {tool.description}
            </span>
            <span
              className={cn(
                "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                tool.isAI
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600",
              )}
            >
              <Coins className="size-3" />
              {tool.credits} {tool.credits === 1 ? "crédito" : "créditos"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
