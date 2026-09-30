import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import LoginButton from "./_components/LoginButton";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  let errorMessage: string | null = null;
  if (error === "session_expired") {
    errorMessage = "Sua sessão expirou. Faça login novamente para continuar.";
  } else if (error) {
    errorMessage = "Ocorreu uma falha na autenticação. Tente novamente.";
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Entre na Kroma e comece a editar suas imagens
            </h1>
            <p className="text-slate-500">
              Não perca tempo e dinheiro, entre com sua conta Google para
              começar a editar suas imagens.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-3 p-4 text-sm rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <LoginButton />

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
      <div className="hidden lg:block relative flex-1">
        <Image
          src="/images/sky.jpg"
          alt="Sky Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
