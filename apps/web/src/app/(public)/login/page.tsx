import Link from "next/link";
import Image from "next/image";
import LoginButton from "./_components/LoginButton";

export default function LoginPage() {
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
