"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    if (success === "true") {
      router.replace("/studio");
    } else {
      setStatus("error");
      setErrorMessage("Autenticação falhou");
    }
  }, [searchParams, router]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Erro na autenticação
          </h1>
          <p className="text-slate-600">{errorMessage}</p>
          <button
            onClick={() => router.push("/login")}
            className="text-primary hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="size-8 animate-spin mx-auto text-primary" />
        <p className="text-slate-600">Autenticando...</p>
      </div>
    </div>
  );
}
