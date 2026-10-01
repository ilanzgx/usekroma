"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginButton() {
  const handleLoginWithGoogle = () => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080/v1";
    const apiUrl = rawUrl.endsWith("/v1") ? rawUrl : `${rawUrl.replace(/\/+$/, "")}/v1`;
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <Button
      onClick={handleLoginWithGoogle}
      className="w-full h-11 text-sm font-medium gap-3 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 shadow-xs transition-all hover:border-zinc-300 cursor-pointer"
      variant="outline"
    >
      <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
      Continuar com o Google
    </Button>
  );
}
