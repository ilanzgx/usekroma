"use client";

import { useUser } from "@/contexts/user-context";

export default function WelcomeBanner() {
  const { user } = useUser();

  return (
    <div className="animate-gradient flex flex-col items-center justify-center rounded-xl border bg-[linear-gradient(to_right,var(--color-purple-100),var(--color-purple-200),var(--color-pink-100),var(--color-pink-200),var(--color-purple-100))] py-5 text-center">
      <h1 className="text-2xl font-bold">
        Bem-vindo ao Kroma Studio, {user?.name || "Visitante"}!
      </h1>
      <p className="text-lg text-muted-foreground">
        O que você deseja criar hoje?
      </p>
    </div>
  );
}
