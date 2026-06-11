"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginButton() {
  const handleLoginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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
