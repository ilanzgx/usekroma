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
      className="w-full py-6 text-base gap-3"
      variant="outline"
    >
      <Image src="/google-icon.svg" alt="Google" width={24} height={24} />
      Entrar com o Google
    </Button>
  );
}
