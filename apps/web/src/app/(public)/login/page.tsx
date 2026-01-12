"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/resources/auth";

export default function LoginPage() {
  const handleLoginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Entre na ImageSaaS e comece a editar suas imagens
            </h1>
            <p className="text-slate-500">
              Não perca tempo e dinheiro, entre com sua conta Google para
              começar a editar suas imagens.
            </p>
          </div>

          <Button
            onClick={handleLoginWithGoogle}
            className="w-full py-6 text-base gap-3"
            variant="outline"
          >
            <Image src="/google.png" alt="Google" width={20} height={20} />
            Entrar com o Google
          </Button>

          <p className="text-center text-sm text-slate-400">
            Criando uma conta, você concorda com todos os nossos{" "}
            <Link href="/termos" className="text-slate-600 hover:underline">
              termos e condições
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md space-y-6 text-white">
          <h1>Imagem</h1>
        </div>
      </div>
    </div>
  );
}
