import {
  Square,
  RectangleVertical,
  RectangleHorizontal,
  Smartphone,
  Image,
  MonitorPlay,
  LucideIcon,
} from "lucide-react";

export interface Resize {
  id: string;
  slugs: string[];
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  aspectRatio: string;
}

export const RESIZES: Resize[] = [
  {
    id: "square",
    slugs: ["square", "quadrado"],
    name: "Quadrado",
    description: "Proporção 1:1",
    icon: Square,
    color: "text-blue-500",
    aspectRatio: "1:1",
  },
  {
    id: "portrait",
    slugs: ["portrait", "retrato"],
    name: "Retrato",
    description: "Proporção 4:5",
    icon: RectangleVertical,
    color: "text-pink-500",
    aspectRatio: "4:5",
  },
  {
    id: "portrait-classic",
    slugs: ["portrait-classic", "retrato-classico"],
    name: "Retrato Clássico",
    description: "Proporção 3:4",
    icon: RectangleVertical,
    color: "text-purple-500",
    aspectRatio: "3:4",
  },
  {
    id: "landscape",
    slugs: ["landscape", "paisagem"],
    name: "Paisagem",
    description: "Proporção 16:9",
    icon: RectangleHorizontal,
    color: "text-green-500",
    aspectRatio: "16:9",
  },
  {
    id: "classic",
    slugs: ["classic", "classico"],
    name: "Clássico",
    description: "Proporção 4:3",
    icon: Image,
    color: "text-amber-500",
    aspectRatio: "4:3",
  },
  {
    id: "story",
    slugs: ["story", "stories"],
    name: "Story/Reels",
    description: "Proporção 9:16",
    icon: Smartphone,
    color: "text-orange-500",
    aspectRatio: "9:16",
  },
  {
    id: "ultrawide",
    slugs: ["ultrawide", "cinema"],
    name: "Ultrawide",
    description: "Proporção 21:9",
    icon: MonitorPlay,
    color: "text-cyan-500",
    aspectRatio: "21:9",
  },
];

export function getResizeById(id: string): Resize | undefined {
  return RESIZES.find((resize) => resize.id === id);
}

export function getResizeBySlug(slug: string): Resize | undefined {
  return RESIZES.find((resize) => resize.slugs.includes(slug));
}

export function getAllResizeSlugs(): { resize: string }[] {
  return RESIZES.flatMap((resize) =>
    resize.slugs.map((slug) => ({ resize: slug })),
  );
}
