"use client";

import { cn } from "@/lib/utils";
import { SOCIAL_FORMATS, getAllPlatforms } from "@/lib/socials";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function SocialMediaSection() {
  const platforms = getAllPlatforms();

  return (
    <div className="border rounded-md p-4">
      <h1 className="text-xl font-bold mb-4">Redes Sociais</h1>

      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const formats = SOCIAL_FORMATS.filter((f) => f.platform === platform);
          const PlatformIcon = formats[0].platformIcon;
          const platformColor = formats[0].platformColor;

          // Se tiver apenas 1 opção, mostra direto o link com as dimensões
          if (formats.length === 1) {
            const format = formats[0];
            return (
              <Link
                key={platform}
                href={`/studio/social/${format.slugs[1] || format.slugs[0]}`}
                className="group flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <PlatformIcon className={cn("size-4", platformColor)} />
                <span className="text-sm font-medium">{platform}</span>
                <span className="text-xs text-muted-foreground">
                  {format.width}x{format.height}
                </span>
              </Link>
            );
          }

          // Se tiver múltiplas opções, mostra dropdown
          return (
            <DropdownMenu key={platform}>
              <DropdownMenuTrigger className="group flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors outline-none">
                <PlatformIcon className={cn("size-4", platformColor)} />
                <span className="text-sm font-medium">{platform}</span>
                <span className="text-xs text-muted-foreground">
                  {formats.length} opções
                </span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {formats.map((format) => (
                  <DropdownMenuItem key={format.id} asChild>
                    <Link
                      href={`/studio/social/${format.slugs[1] || format.slugs[0]}`}
                      className="flex justify-between gap-4 cursor-pointer"
                    >
                      <span>{format.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format.width}x{format.height}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
}
