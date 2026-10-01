import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowLeft, Image as ImageIcon, Check } from "lucide-react";
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
    <div className="min-h-screen bg-[#FAFAFA] flex text-[#09090B] font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Formulário de Login (Esquerda) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto lg:mx-0 w-full">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" />
            Voltar ao início
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="size-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <ImageIcon className="size-4.5" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900">Kroma</span>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
              Entre na sua conta
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Acesse o estúdio de ferramentas e seu saldo de créditos. Novas contas recebem 50
              créditos automaticamente.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 text-xs rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <LoginButton />

            <div className="flex items-center gap-2 text-xs text-zinc-500 justify-center">
              <Check className="size-3.5 text-zinc-400" />
              <span>50 créditos concedidos no cadastro</span>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 leading-relaxed pt-4">
            Ao continuar, você concorda com nossos{" "}
            <Link
              href="/termos"
              className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Termos de Uso
            </Link>{" "}
            e nossa{" "}
            <Link
              href="/privacidade"
              className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="text-xs text-zinc-400 text-center lg:text-left pt-8">
          © {new Date().getFullYear()} Kroma
        </div>
      </div>

      {/* Paisagem fotográfica (Direita - Desktop) */}
      <div className="hidden lg:block relative flex-1 border-l border-zinc-200">
        <Image
          src="/images/sky.jpg"
          alt="Paisagem natural"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
