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
    name: "Remover Fundo",
    description: "Remova o fundo de suas imagens.",
    icon: Wand2,
    color: "text-purple-500",
    operation: "remove_background",
    seo: {
      title: "Remover Fundo de Imagens - Ferramenta IA Grátis",
      description:
        "Remova fundos de imagens automaticamente usando IA. Ferramenta online grátis que funciona com arquivos PNG, JPG e WebP.",
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
    name: "Nitidez",
    description: "Melhore a nitidez de suas imagens.",
    icon: Focus,
    color: "text-yellow-500",
    operation: "sharpen",
    seo: {
      title: "Melhorar Nitidez de Imagens Online - Ferramenta Grátis",
      description:
        "Melhore a clareza e nitidez da imagem instantaneamente. Ferramenta online grátis para deixar suas fotos nítidas e profissionais.",
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
    name: "Preto e Branco",
    description: "Converta suas imagens para preto e branco.",
    icon: Palette,
    color: "text-gray-500",
    operation: "grayscale",
    seo: {
      title: "Converter Imagens para Preto e Branco - Ferramenta Grátis",
      description:
        "Transforme suas fotos coloridas em impressionantes imagens em preto e branco. Conversor grayscale online grátis.",
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
    name: "Cortar Imagem",
    description: "Corte suas imagens.",
    icon: Crop,
    color: "text-green-500",
    operation: "crop",
    seo: {
      title: "Cortar Imagens Online - Ferramenta de Corte Grátis",
      description:
        "Corte e redimensione suas imagens online facilmente. Ferramenta grátis para ajustar fotos para qualquer tamanho ou proporção.",
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
    name: "Desfocar",
    description: "Desfoque suas imagens.",
    icon: CircleDashed,
    color: "text-blue-500",
    operation: "blur",
    seo: {
      title: "Desfocar Imagens Online - Ferramenta de Desfoque Grátis",
      description:
        "Adicione efeitos de desfoque às suas imagens instantaneamente. Ferramenta online grátis para criar bokeh, desfoque de privacidade e efeitos artísticos.",
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
