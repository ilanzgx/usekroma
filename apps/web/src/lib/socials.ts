import { LucideIcon } from "lucide-react";
import {
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  ImageIcon,
  UserCircle,
  LayoutGrid,
  RectangleHorizontal,
  Smartphone,
  Video,
  Twitch,
} from "lucide-react";

export interface SocialFormat {
  id: string;
  slugs: string[];
  name: string;
  platform: string;
  platformIcon: LucideIcon;
  platformColor: string;
  icon: LucideIcon;
  width: number;
  height: number;
  aspectRatio: string;
}

// Custom TikTok-like icon using Video
const TikTokIcon = Video;

// Custom Pinterest-like icon using LayoutGrid
const PinterestIcon = LayoutGrid;

export const SOCIAL_FORMATS: SocialFormat[] = [
  // Instagram
  {
    id: "instagram-post-square",
    slugs: ["instagram-post-square", "instagram-post-quadrado"],
    name: "Post Feed",
    platform: "Instagram",
    platformIcon: Instagram,
    platformColor: "text-pink-500",
    icon: ImageIcon,
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  {
    id: "instagram-post-portrait",
    slugs: ["instagram-post-portrait", "instagram-post-retrato"],
    name: "Post Retrato",
    platform: "Instagram",
    platformIcon: Instagram,
    platformColor: "text-pink-500",
    icon: ImageIcon,
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  {
    id: "instagram-story",
    slugs: ["instagram-story", "instagram-stories"],
    name: "Story/Reels",
    platform: "Instagram",
    platformIcon: Instagram,
    platformColor: "text-pink-500",
    icon: Smartphone,
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "instagram-profile",
    slugs: ["instagram-profile", "instagram-perfil"],
    name: "Foto de Perfil",
    platform: "Instagram",
    platformIcon: Instagram,
    platformColor: "text-pink-500",
    icon: UserCircle,
    width: 320,
    height: 320,
    aspectRatio: "1:1",
  },

  // TikTok
  {
    id: "tiktok-video",
    slugs: ["tiktok-video", "tiktok"],
    name: "Vídeo/Thumb",
    platform: "TikTok",
    platformIcon: TikTokIcon,
    platformColor: "text-black",
    icon: Smartphone,
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },

  // YouTube
  {
    id: "youtube-thumbnail",
    slugs: ["youtube-thumbnail", "youtube-miniatura"],
    name: "Thumbnail",
    platform: "YouTube",
    platformIcon: Youtube,
    platformColor: "text-red-500",
    icon: ImageIcon,
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
  },
  {
    id: "youtube-banner",
    slugs: ["youtube-banner", "youtube-capa"],
    name: "Banner do Canal",
    platform: "YouTube",
    platformIcon: Youtube,
    platformColor: "text-red-500",
    icon: RectangleHorizontal,
    width: 2560,
    height: 1440,
    aspectRatio: "16:9",
  },
  {
    id: "youtube-profile",
    slugs: ["youtube-profile", "youtube-perfil"],
    name: "Foto de Perfil",
    platform: "YouTube",
    platformIcon: Youtube,
    platformColor: "text-red-500",
    icon: UserCircle,
    width: 800,
    height: 800,
    aspectRatio: "1:1",
  },

  // LinkedIn
  {
    id: "linkedin-post-landscape",
    slugs: ["linkedin-post-landscape", "linkedin-post-paisagem"],
    name: "Post Paisagem",
    platform: "LinkedIn",
    platformIcon: Linkedin,
    platformColor: "text-blue-600",
    icon: ImageIcon,
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
  },
  {
    id: "linkedin-post-square",
    slugs: ["linkedin-post-square", "linkedin-post-quadrado"],
    name: "Post Quadrado",
    platform: "LinkedIn",
    platformIcon: Linkedin,
    platformColor: "text-blue-600",
    icon: ImageIcon,
    width: 1200,
    height: 1200,
    aspectRatio: "1:1",
  },
  {
    id: "linkedin-banner",
    slugs: ["linkedin-banner", "linkedin-capa"],
    name: "Banner",
    platform: "LinkedIn",
    platformIcon: Linkedin,
    platformColor: "text-blue-600",
    icon: RectangleHorizontal,
    width: 1584,
    height: 396,
    aspectRatio: "4:1",
  },
  {
    id: "linkedin-profile",
    slugs: ["linkedin-profile", "linkedin-perfil"],
    name: "Foto de Perfil",
    platform: "LinkedIn",
    platformIcon: Linkedin,
    platformColor: "text-blue-600",
    icon: UserCircle,
    width: 400,
    height: 400,
    aspectRatio: "1:1",
  },

  // Pinterest
  {
    id: "pinterest-pin",
    slugs: ["pinterest-pin", "pinterest"],
    name: "Pin Padrão",
    platform: "Pinterest",
    platformIcon: PinterestIcon,
    platformColor: "text-red-600",
    icon: ImageIcon,
    width: 1000,
    height: 1500,
    aspectRatio: "2:3",
  },
  {
    id: "pinterest-pin-long",
    slugs: ["pinterest-pin-long", "pinterest-pin-longo"],
    name: "Pin Longo",
    platform: "Pinterest",
    platformIcon: PinterestIcon,
    platformColor: "text-red-600",
    icon: ImageIcon,
    width: 1000,
    height: 2100,
    aspectRatio: "1:2.1",
  },

  // Twitter/X
  {
    id: "twitter-post",
    slugs: ["twitter-post", "x-post"],
    name: "Post",
    platform: "Twitter/X",
    platformIcon: Twitter,
    platformColor: "text-sky-500",
    icon: ImageIcon,
    width: 1600,
    height: 900,
    aspectRatio: "16:9",
  },
  {
    id: "twitter-header",
    slugs: ["twitter-header", "x-header"],
    name: "Header",
    platform: "Twitter/X",
    platformIcon: Twitter,
    platformColor: "text-sky-500",
    icon: RectangleHorizontal,
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },

  // Facebook
  {
    id: "facebook-post",
    slugs: ["facebook-post"],
    name: "Post",
    platform: "Facebook",
    platformIcon: Facebook,
    platformColor: "text-blue-500",
    icon: ImageIcon,
    width: 1200,
    height: 630,
    aspectRatio: "1.9:1",
  },
  {
    id: "facebook-cover",
    slugs: ["facebook-cover", "facebook-capa"],
    name: "Capa",
    platform: "Facebook",
    platformIcon: Facebook,
    platformColor: "text-blue-500",
    icon: RectangleHorizontal,
    width: 820,
    height: 312,
    aspectRatio: "2.6:1",
  },
  {
    id: "facebook-profile",
    slugs: ["facebook-profile", "facebook-perfil"],
    name: "Foto de Perfil",
    platform: "Facebook",
    platformIcon: Facebook,
    platformColor: "text-blue-500",
    icon: UserCircle,
    width: 170,
    height: 170,
    aspectRatio: "1:1",
  },

  // Twitch
  {
    id: "twitch-stream",
    slugs: ["twitch-stream", "twitch"],
    name: "Stream/Thumbnail",
    platform: "Twitch",
    platformIcon: Twitch,
    platformColor: "text-purple-500",
    icon: ImageIcon,
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
  },
];

export function getSocialFormatById(id: string): SocialFormat | undefined {
  return SOCIAL_FORMATS.find((format) => format.id === id);
}

export function getSocialFormatBySlug(slug: string): SocialFormat | undefined {
  return SOCIAL_FORMATS.find((format) => format.slugs.includes(slug));
}

export function getSocialFormatsByPlatform(platform: string): SocialFormat[] {
  return SOCIAL_FORMATS.filter((format) => format.platform === platform);
}

export function getAllPlatforms(): string[] {
  return [...new Set(SOCIAL_FORMATS.map((format) => format.platform))];
}

export function getAllSocialSlugs(): { social: string }[] {
  return SOCIAL_FORMATS.flatMap((format) =>
    format.slugs.map((slug) => ({ social: slug })),
  );
}
