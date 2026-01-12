"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <ImageIcon className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">ImageSaaS</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Cadastre-se</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Fazer Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 flex justify-center min-h-[calc(100vh-4rem)] pt-28">
        <div className="flex flex-col gap-6 text-center max-w-3xl">
          <h1 className="text-6xl font-bold">Transforme suas imagens</h1>
          <p className="text-xl text-muted-foreground">
            Plataforma de edição de imagens. Edite e transforme suas imagens com
            facilidade, sem precisar de conhecimento técnico.
          </p>
          <Button
            asChild
            className="mt-6 px-12 py-6 text-lg flex items-center gap-2"
          >
            <Link href="/studio">
              <span>Começar agora</span>
              <ArrowRightIcon className="size-7" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
