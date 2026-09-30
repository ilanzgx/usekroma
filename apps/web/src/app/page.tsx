import Link from "next/link";
import Image from "next/image";
import { getProfile } from "@/resources/auth";
import { TOOLS } from "@/lib/tools";
import BeforeAfterSlider from "@/components/before-after-slider";
import { ArrowRight, Sparkles, Check, Coins, Zap, Shield, Image as ImageIcon } from "lucide-react";

export default async function Home() {
  const user = await getProfile();

  // Divide tools into AI-powered and Standard for the asymmetric grid layout
  const aiTools = TOOLS.filter((t) => t.isAI);
  const standardTools = TOOLS.filter((t) => !t.isAI);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-md bg-[#09090B] flex items-center justify-center transition-transform group-hover:scale-95 duration-200">
              <ImageIcon className="size-5 text-[#FAFAFA]" />
            </div>
            <span className="font-semibold text-xl tracking-tight">Kroma</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#features" className="hover:text-zinc-950 transition-colors">
              Recursos
            </a>
            <a href="#credits" className="hover:text-zinc-950 transition-colors">
              Créditos
            </a>
            <a href="#about" className="hover:text-zinc-950 transition-colors">
              Sobre a IA
            </a>
          </nav>

          {/* Dynamic Action Buttons based on Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3.5">
                <span className="hidden sm:inline text-xs font-mono text-zinc-400">{user.credits} CRÉDITOS</span>
                <Link href="/studio" className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase bg-[#09090B] text-white px-4 py-2.5 rounded-md hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs">
                  Ir para o Estúdio
                  <ArrowRight className="size-3.5" />
                </Link>
                {/* User Avatar */}
                {user.picture && <Image src={user.picture} alt={user.name} width={32} height={32} className="size-8 rounded-full border border-zinc-200 object-cover" />}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
                  Entrar
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center text-xs font-mono tracking-wider uppercase bg-[#09090B] text-white px-4.5 py-2.5 rounded-md hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs">
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Asymmetric Split) */}
      <section className="max-w-350 mx-auto px-6 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Left Hero Text: Asymmetric Left-Aligned */}
          <div className="lg:col-span-5 space-y-8 text-left max-w-xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider">
              <Sparkles className="size-3 text-zinc-500" />
              Tecnologia de Edição Inteligente
            </div>

            {/* Title with Inline Image Typography */}
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#09090B] leading-[1.15]">
              Edição de imagens
              <span className="inline-flex items-center justify-center align-middle mx-2.5 size-9 rounded-full bg-zinc-200 border border-zinc-300 relative overflow-hidden group">
                <span className="absolute inset-2 rounded-full bg-zinc-900 animate-pulse" />
              </span>
              com precisão de laboratório.
            </h1>

            <p className="text-base sm:text-lg text-zinc-500 font-light leading-relaxed">Kroma é uma plataforma minimalista de processamento de imagens. Remova fundos instantaneamente, faça upscale sem perda de definição e estilize suas fotos através de modelos neurais refinados.</p>

            {/* CTA and Stats */}
            <div className="pt-2 space-y-4">
              <Link href={user ? "/studio" : "/login"} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-mono tracking-wider uppercase bg-[#09090B] text-white px-8 py-4 rounded-md hover:bg-zinc-800 transition-all active:scale-[0.98] active:translate-y-[1px] shadow-sm">
                <span>{user ? "Acessar Painel" : "Começar Agora"}</span>
                <ArrowRight className="size-4" />
              </Link>

              <div className="flex items-center gap-5 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Check className="size-3.5 text-zinc-500" />
                  Sem Cartão Requerido
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <Check className="size-3.5 text-zinc-500" />
                  50 Créditos Grátis no Cadastro
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visuals: Interactive Slider */}
          <div className="lg:col-span-7 w-full">
            <BeforeAfterSlider />
          </div>
        </div>
      </section>

      {/* 3. FEATURES & TOOLS SHOWCASE (Asymmetric Grid Layout) */}
      <section id="features" className="border-t border-zinc-200 bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">As Ferramentas</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Processamento sob demanda. Inteligência artificial na ponta dos dedos.</h2>
            <p className="text-zinc-500 font-light leading-relaxed">Construído para fotógrafos, designers e desenvolvedores. Nossa arquitetura isolada garante velocidade e isolamento de recursos para cada tarefa.</p>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Col-span-7: Main AI Features (Bento Large Card) */}
            <div className="lg:col-span-7 flex flex-col justify-between border border-zinc-200 rounded-2xl p-8 sm:p-10 hover:border-zinc-300 transition-all duration-300 bg-[#FAFAFA]">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 text-[#FAFAFA] px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                  <Sparkles className="size-3" />
                  Modelos de IA Avançados
                </div>

                <div className="space-y-6">
                  {aiTools.map((tool) => (
                    <div key={tool.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-200/60 pb-6 last:border-0 last:pb-0">
                      <div className="space-y-1 max-w-md">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {tool.name}
                          <span className="text-[10px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">IA</span>
                        </h3>
                        <p className="text-sm text-zinc-500 font-light">{tool.description}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400">
                          <Coins className="size-3.5" />
                          {tool.credits} créditos
                        </span>
                        <Link href="/login" className="size-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-[#09090B] hover:text-white transition-all group-hover:translate-x-1">
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-8 mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Processamento instantâneo via Worker Python</span>
                <span className="text-xs text-zinc-500 font-light">Resultados em alta definição prontos para download.</span>
              </div>
            </div>

            {/* Col-span-5: Standard Filters & Adjustments (Bento Stacked Card) */}
            <div className="lg:col-span-5 flex flex-col justify-between border border-zinc-200 rounded-2xl p-8 sm:p-10 hover:border-zinc-300 transition-all duration-300 bg-[#FAFAFA]">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 text-zinc-800 px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                  <Zap className="size-3" />
                  Filtros & Ajustes Padrão
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  {standardTools.slice(0, 8).map((tool) => (
                    <div key={tool.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <tool.icon className="size-4 text-zinc-600" />
                        <h4 className="text-sm font-semibold">{tool.name}</h4>
                      </div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-8 mt-10">
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Transformações estruturais, nitidez, brilho, espelhamento e efeitos tradicionais. Otimizado para renderização rápida com consumo de apenas <span className="font-mono font-semibold text-zinc-700">1 a 2 créditos</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CREDIT SYSTEM SECTION (Total Transparency) */}
      <section id="credits" className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Left side text */}
            <div className="lg:col-span-4 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Preços & Créditos</span>
              <h2 className="text-3xl font-semibold tracking-tight text-[#09090B]">Transparência absoluta. Pague apenas pelo que utilizar.</h2>
              <p className="text-zinc-500 font-light leading-relaxed">Esqueça planos de assinatura mensais caros e limites artificiais. Na Kroma, você opera por meio de créditos consumidos por operação.</p>
              <div className="bg-white border border-zinc-200 p-5 rounded-lg space-y-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">Créditos de Entrada</span>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Ganhe <span className="font-mono font-bold text-[#09090B] text-base">50 créditos</span> ao criar sua conta de forma instantânea para começar a editar suas fotos imediatamente.
                </p>
              </div>
            </div>

            {/* Right side cost sheet (Monochrome Clean Table) */}
            <div className="lg:col-span-8 w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-6 border-b border-zinc-200 bg-[#FAFAFA]/50">
                <span className="text-xs font-mono tracking-wider uppercase text-zinc-500">Tabela de Custo de Operações</span>
              </div>
              <div className="divide-y divide-zinc-100 font-mono text-xs">
                {/* Headers */}
                <div className="flex px-6 py-3.5 bg-zinc-50 text-zinc-400 font-bold uppercase tracking-wider">
                  <div className="w-1/2">Operação</div>
                  <div className="w-1/4 text-center">Tecnologia</div>
                  <div className="w-1/4 text-right">Custo unitário</div>
                </div>

                <div className="flex px-6 py-4 items-center hover:bg-zinc-50/55 transition-colors">
                  <div className="w-1/2 font-sans font-semibold text-zinc-900">Remover Fundo</div>
                  <div className="w-1/4 text-center">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Inteligência Artificial</span>
                  </div>
                  <div className="w-1/4 text-right font-bold text-zinc-900">10 CRÉDITOS</div>
                </div>

                <div className="flex px-6 py-4 items-center hover:bg-zinc-50/55 transition-colors">
                  <div className="w-1/2 font-sans font-semibold text-zinc-900">Aumentar Resolução</div>
                  <div className="w-1/4 text-center">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Super Resolução</span>
                  </div>
                  <div className="w-1/4 text-right font-bold text-zinc-900">5 CRÉDITOS</div>
                </div>

                <div className="flex px-6 py-4 items-center hover:bg-zinc-50/55 transition-colors">
                  <div className="w-1/2 font-sans font-semibold text-zinc-900">Cartoon, Pintura a Óleo, Sketch</div>
                  <div className="w-1/4 text-center text-zinc-500">Filtro Artístico</div>
                  <div className="w-1/4 text-right font-bold text-zinc-900">2 CRÉDITOS</div>
                </div>

                <div className="flex px-6 py-4 items-center hover:bg-zinc-50/55 transition-colors">
                  <div className="w-1/2 font-sans font-semibold text-zinc-900">Nitidez, Blur, Grayscale, Sépia, Vinheta</div>
                  <div className="w-1/4 text-center text-zinc-500">Ajuste Básico</div>
                  <div className="w-1/4 text-right font-bold text-zinc-900">1 CRÉDITO</div>
                </div>

                <div className="flex px-6 py-4 items-center hover:bg-zinc-50/55 transition-colors">
                  <div className="w-1/2 font-sans font-semibold text-zinc-900">Resize, Inverter, Espelhar, Girar</div>
                  <div className="w-1/4 text-center text-zinc-500">Transformação</div>
                  <div className="w-1/4 text-right font-bold text-zinc-900">1 CRÉDITO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT THE AI */}
      <section id="about" className="py-24 md:py-32 bg-white border-t border-zinc-200">
        <div className="max-w-350 mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Tech Specs Left side */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Tecnologia e Performance</span>
              <h2 className="text-3xl font-semibold tracking-tight text-[#09090B]">Processamento ultrarrápido com privacidade absoluta.</h2>
              <p className="text-zinc-500 font-light leading-relaxed">Nossos servidores foram estruturados para processar edições complexas em menos de 2 segundos. Desenvolvemos algoritmos que identificam o assunto principal da foto e removem o fundo com máxima precisão, sem comprometer a resolução original da sua imagem.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-zinc-700" />
                    <span className="font-semibold text-sm">Privacidade Garantida</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Seus arquivos processados são temporários e deletados automaticamente após download.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-zinc-700" />
                    <span className="font-semibold text-sm">Velocidade Máxima</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Fila assíncrona de processamento com semáforo dedicado para evitar gargalos.</p>
                </div>
              </div>
            </div>

            {/* Visual Abstract Wireframe Right side */}
            <div className="lg:col-span-6 border border-zinc-200 bg-[#FAFAFA] rounded-2xl p-8 sm:p-10 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
              <div className="space-y-6 font-mono text-[11px] text-zinc-400 relative z-10">
                <div className="flex justify-between border-b border-zinc-200/60 pb-3">
                  <span>SYSTEM_STATUS</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    OPERATIONAL
                  </span>
                </div>
                <div className="space-y-1 text-zinc-500">
                  <p>&gt; Upload completo. Carregando imagem...</p>
                  <p>&gt; Analisando elementos visuais...</p>
                  <p>&gt; Isolando o elemento principal da foto...</p>
                  <p className="text-zinc-800 font-semibold">&gt; Sucesso: Fundo removido em 1.2 segundos</p>
                  <p className="text-zinc-800 font-semibold">&gt; Imagem em alta resolução pronta para download</p>
                </div>
                <div className="border-t border-zinc-200/60 pt-4 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>TIME: {new Date().toLocaleDateString("pt-BR")}</span>
                  <span>NODE_ID: WORKER-IMAGE-01</span>
                </div>
              </div>

              {/* Decorative faint background grid lines */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-sm bg-[#09090B] flex items-center justify-center">
              <ImageIcon className="size-4 text-[#FAFAFA]" />
            </div>
            <span className="font-semibold text-base tracking-tight">Kroma</span>
          </div>

          <p className="text-xs text-zinc-400 font-light">© {new Date().getFullYear()} Kroma. Todos os direitos reservados. Edição de imagem facilitada com IA.</p>

          <div className="flex gap-6 text-xs text-zinc-400">
            <Link href="/termos" className="hover:text-zinc-950 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-zinc-950 transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
