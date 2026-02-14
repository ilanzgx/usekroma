"use client";

import { getProfile } from "@/resources/auth";
import { User } from "@/resources/user";
import { useEffect, useState } from "react";
import ToolsSection from "./_components/tools-section";
import ResizeSection from "./_components/resize-section";
import SocialMediaSection from "./_components/social-section";

export default function StudioPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile().then((response) => {
      setUser(response);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="animate-gradient flex flex-col items-center justify-center rounded-xl border bg-[linear-gradient(to_right,var(--color-purple-100),var(--color-purple-200),var(--color-pink-100),var(--color-pink-200),var(--color-purple-100))] py-5 text-center">
        <h1 className="text-2xl font-bold">
          Bem-vindo ao Kroma Studio, {user?.name || "Visitante"}!
        </h1>
        <p className="text-lg text-muted-foreground">
          O que você deseja criar hoje?
        </p>
      </div>
      <ResizeSection />
      <ToolsSection />
      <SocialMediaSection />
    </div>
  );
}
