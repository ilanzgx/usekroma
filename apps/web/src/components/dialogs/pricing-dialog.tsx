"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl min-h-[65vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle className="text-2xl font-bold text-center">
            Atualize seu plano
          </DialogTitle>
          <DialogDescription className="text-center">
            Escolha o plano ideal para suas necessidades e desbloqueie todo o
            potencial do Kroma.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* free plan */}
          <div className="flex flex-col gap-4 rounded-lg border p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Gratuito</h3>
              <div className="text-3xl font-bold">
                R$ 0
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Para quem está começando.
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Atual
            </Button>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> 50 créditos iniciais
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Ferramentas básicas
              </li>
            </ul>
          </div>

          {/* pro plan */}
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-muted/50 p-6">
            <div className="absolute top-0 right-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Pro</h3>
              <div className="text-3xl font-bold">
                R$ 14,90
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Para criadores de conteúdo.
              </p>
            </div>
            <Button className="w-full">Assinar Agora</Button>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> 200 créditos mensais
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Acesso a ferramentas
                IA
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Sem marca d'água
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Suporte prioritário
              </li>
            </ul>
          </div>

          {/* ultimate plan */}
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-muted/50 p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Ultimate</h3>
              <div className="text-3xl font-bold">
                R$ 29,90
                <span className="text-sm font-normal text-muted-foreground">
                  /mês
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Para criadores de conteúdo.
              </p>
            </div>
            <Button className="w-full">Assinar Agora</Button>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> 800 créditos mensais
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Acesso a ferramentas
                IA
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Sem marca d'água
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Suporte prioritário
              </li>
            </ul>
          </div>

          {/* enterprise plan */}
          <div className="flex flex-col gap-4 rounded-lg border p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Enterprise</h3>
              <div className="text-3xl font-bold">Sob Consulta</div>
              <p className="text-sm text-muted-foreground">
                Para grandes times.
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Fale Conosco
            </Button>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Créditos ilimitados
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
