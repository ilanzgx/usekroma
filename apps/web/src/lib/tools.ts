import { ImageProcessOperations } from "@/resources/image/image.types";
import {
  Wand2,
  Focus,
  Palette,
  Maximize2,
  CircleDashed,
  LucideIcon,
  Droplets,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Circle,
} from "lucide-react";

export interface Tool {
  id: string;
  slugs: string[]; // url aliases
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  operation: ImageProcessOperations;
  isAI?: boolean;
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
    isAI: true,
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
    id: "ai-upscale",
    slugs: ["ai-upscale", "aumentar-resolucao"],
    name: "Aumentar Resolução",
    description: "Aumente a resolução em até 2x com IA.",
    icon: Maximize2,
    color: "text-emerald-500",
    operation: "ai_upscale",
    isAI: true,
    seo: {
      title: "Aumentar Resolução de Imagens com IA - Ferramenta Grátis",
      description:
        "Aumente a resolução das suas imagens em até 2x usando inteligência artificial. Upscale sem perder qualidade.",
      keywords: [
        "upscale image",
        "increase resolution",
        "AI upscale",
        "image enhancer",
        "2x upscale",
        "aumentar resolução",
        "melhorar qualidade",
        "super resolução",
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
  {
    id: "saturate",
    slugs: ["saturate", "saturacao"],
    name: "Saturação",
    description: "Ajuste a saturação de cores.",
    icon: Droplets,
    color: "text-cyan-500",
    operation: "saturate",
    seo: {
      title: "Ajustar Saturação de Imagens - Ferramenta Grátis",
      description:
        "Intensifique ou reduza as cores de suas imagens. Ferramenta online grátis para ajustar saturação.",
      keywords: [
        "saturation",
        "color saturation",
        "vibrance",
        "saturação",
        "cores vibrantes",
      ],
    },
  },
  {
    id: "flip-horizontal",
    slugs: ["flip-horizontal", "espelhar"],
    name: "Espelhar",
    description: "Espelhe suas imagens horizontalmente.",
    icon: FlipHorizontal,
    color: "text-indigo-500",
    operation: "flip_horizontal",
    seo: {
      title: "Espelhar Imagens Online - Ferramenta Grátis",
      description:
        "Espelhe suas imagens horizontalmente de forma instantânea. Ferramenta online grátis para flip horizontal.",
      keywords: [
        "flip horizontal",
        "mirror image",
        "espelhar imagem",
        "inverter horizontal",
      ],
    },
  },
  {
    id: "flip-vertical",
    slugs: ["flip-vertical", "inverter"],
    name: "Inverter",
    description: "Inverta suas imagens verticalmente.",
    icon: FlipVertical,
    color: "text-teal-500",
    operation: "flip_vertical",
    seo: {
      title: "Inverter Imagens Online - Ferramenta Grátis",
      description:
        "Inverta suas imagens verticalmente de forma instantânea. Ferramenta online grátis para flip vertical.",
      keywords: [
        "flip vertical",
        "upside down",
        "inverter imagem",
        "virar imagem",
      ],
    },
  },
  {
    id: "sepia",
    slugs: ["sepia"],
    name: "Sépia",
    description: "Aplique efeito sépia vintage.",
    icon: Sun,
    color: "text-amber-600",
    operation: "sepia",
    seo: {
      title: "Efeito Sépia em Imagens - Ferramenta Grátis",
      description:
        "Transforme suas fotos com o clássico efeito sépia vintage. Ferramenta online grátis.",
      keywords: [
        "sepia filter",
        "vintage effect",
        "old photo",
        "efeito sépia",
        "foto antiga",
      ],
    },
  },
  {
    id: "vignette",
    slugs: ["vignette", "vinheta"],
    name: "Vinheta",
    description: "Adicione efeito de vinheta.",
    icon: Circle,
    color: "text-slate-600",
    operation: "vignette",
    seo: {
      title: "Efeito Vinheta em Imagens - Ferramenta Grátis",
      description:
        "Adicione um elegante efeito de vinheta às suas fotos. Ferramenta online grátis.",
      keywords: [
        "vignette effect",
        "photo vignette",
        "dark edges",
        "efeito vinheta",
        "bordas escuras",
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
