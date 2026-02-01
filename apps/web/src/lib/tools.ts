import { ImageProcessOperations } from "@/resources/image/image.types";
import {
  Wand2,
  Focus,
  Palette,
  Crop,
  CircleDashed,
  LucideIcon,
} from "lucide-react";

export interface Tool {
  id: string;
  slugs: string[]; // url aliases
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  operation: ImageProcessOperations;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const TOOLS: Tool[] = [
  {
    id: "remove-background",
    slugs: ["remove-background", "remover-fundo"],
    name: "Remove Background",
    description: "Remove the background from your images.",
    icon: Wand2,
    color: "text-purple-500",
    operation: "remove_background",
    seo: {
      title: "Remove Background from Images - Free AI Tool",
      description:
        "Automatically remove backgrounds from your images using AI. Free online tool that works with PNG, JPG, and WebP files.",
      keywords: [
        "remove background",
        "background remover",
        "transparent background",
        "AI image editing",
        "remover fundo",
        "fundo transparente",
      ],
    },
  },
  {
    id: "sharpen",
    slugs: ["sharpen", "nitidez"],
    name: "Sharpen",
    description: "Sharpen your images.",
    icon: Focus,
    color: "text-yellow-500",
    operation: "sharpen",
    seo: {
      title: "Sharpen Images Online - Free Image Enhancement Tool",
      description:
        "Enhance image clarity and sharpness instantly. Free online tool to make your photos look crisp and professional.",
      keywords: [
        "sharpen image",
        "image enhancement",
        "photo sharpening",
        "clarity tool",
        "nitidez imagem",
        "melhorar foto",
      ],
    },
  },
  {
    id: "grayscale",
    slugs: ["grayscale", "preto-e-branco"],
    name: "Black and White",
    description: "Convert your images to black and white.",
    icon: Palette,
    color: "text-gray-500",
    operation: "grayscale",
    seo: {
      title: "Convert Images to Black and White - Free Grayscale Tool",
      description:
        "Transform your color photos into stunning black and white images. Free online grayscale converter.",
      keywords: [
        "black and white",
        "grayscale",
        "monochrome",
        "photo filter",
        "b&w converter",
        "preto e branco",
        "escala de cinza",
      ],
    },
  },
  {
    id: "crop",
    slugs: ["crop", "cortar-imagem"],
    name: "Crop Image",
    description: "Crop your images.",
    icon: Crop,
    color: "text-green-500",
    operation: "crop",
    seo: {
      title: "Crop Images Online - Free Image Cropping Tool",
      description:
        "Easily crop and resize your images online. Free tool to trim photos to any size or aspect ratio.",
      keywords: [
        "crop image",
        "image cropper",
        "resize photo",
        "trim image",
        "aspect ratio",
        "cortar imagem",
        "recortar foto",
      ],
    },
  },
  {
    id: "blur",
    slugs: ["blur", "desfocar"],
    name: "Blur",
    description: "Blur your images.",
    icon: CircleDashed,
    color: "text-blue-500",
    operation: "blur",
    seo: {
      title: "Blur Images Online - Free Image Blur Tool",
      description:
        "Add blur effects to your images instantly. Free online tool for creating bokeh, privacy blur, and artistic effects.",
      keywords: [
        "blur image",
        "photo blur",
        "bokeh effect",
        "privacy blur",
        "image effects",
        "desfocar imagem",
        "efeito blur",
      ],
    },
  },
];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slugs.includes(slug));
}

export function getAllSlugs(): { tool: string }[] {
  return TOOLS.flatMap((tool) => tool.slugs.map((slug) => ({ tool: slug })));
}
