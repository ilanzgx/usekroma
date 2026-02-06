import {
  ImageIcon,
  UserCircle,
  RectangleHorizontal,
  Smartphone,
  LucideIcon,
} from "lucide-react";

export interface SocialFormat {
  id: string;
  slugs: string[];
  name: string;
  platform: string;
  platformIcon: string; // Path to SVG icon
  icon: LucideIcon;
  width: number;
  height: number;
  aspectRatio: string;
}

export const SOCIAL_FORMATS: SocialFormat[] = [
  // Instagram
  {
    id: "instagram-post-square",
    slugs: ["instagram-post-square", "instagram-post-quadrado"],
    name: "Post Feed",
    platform: "Instagram",
    platformIcon: "/icons/instagram.svg",
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
    platformIcon: "/icons/instagram.svg",
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
    platformIcon: "/icons/instagram.svg",
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
    platformIcon: "/icons/instagram.svg",
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
    platformIcon: "/icons/tiktok.svg",
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
    platformIcon: "/icons/youtube.svg",
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
    platformIcon: "/icons/youtube.svg",
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
    platformIcon: "/icons/youtube.svg",
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
    platformIcon: "/icons/linkedin.svg",
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
    platformIcon: "/icons/linkedin.svg",
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
    platformIcon: "/icons/linkedin.svg",
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
    platformIcon: "/icons/linkedin.svg",
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
    platformIcon: "/icons/pinterest.svg",
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
    platformIcon: "/icons/pinterest.svg",
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
    platformIcon: "/icons/twitter.svg",
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
    platformIcon: "/icons/twitter.svg",
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
    platformIcon: "/icons/facebook.svg",
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
    platformIcon: "/icons/facebook.svg",
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
    platformIcon: "/icons/facebook.svg",
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
    platformIcon: "/icons/twitch.svg",
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
