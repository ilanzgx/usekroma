import Link from "next/link";
import Image from "next/image";
import { getProfile } from "@/resources/auth";
import { TOOLS } from "@/lib/tools";
import { SOCIAL_FORMATS } from "@/lib/socials";
import { RESIZES } from "@/lib/resizes";
import { ArrowRight, Image as ImageIcon, Coins, Sparkles, Layers } from "lucide-react";

export default async function Home() {
  const user = await getProfile();

  const aiTools = TOOLS.filter((t) => t.isAI);
  const standardTools = TOOLS.filter((t) => !t.isAI);

  // Seleção de formatos sociais populares para visualização direta
  const featuredSocials = [
    SOCIAL_FORMATS.find((f) => f.id === "instagram-post-square")!,
    SOCIAL_FORMATS.find((f) => f.id === "instagram-story")!,
    SOCIAL_FORMATS.find((f) => f.id === "tiktok-video")!,
    SOCIAL_FORMATS.find((f) => f.id === "youtube-thumbnail")!,
    SOCIAL_FORMATS.find((f) => f.id === "linkedin-post-landscape")!,
    SOCIAL_FORMATS.find((f) => f.id === "twitter-post")!,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Header alinhado aos padrões do Studio */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <ImageIcon className="size-4.5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Kroma</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/studio"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-700 transition-colors"
                >
                  <Coins className="size-3.5 text-zinc-500" />
                  <span className="font-semibold tabular-nums">{user.credits}</span>
                  <span className="text-zinc-500">créditos</span>
                </Link>

                <Link
                  href="/studio"
                  className="text-xs font-medium bg-zinc-900 text-white px-3.5 py-2 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Abrir estúdio
                </Link>

                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full border border-zinc-200 object-cover"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-semibold text-zinc-700">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-950 px-3 py-1.5 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/login"
                  className="text-xs font-medium bg-zinc-900 text-white px-3.5 py-2 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero centralizado e direto */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#09090B] leading-[1.12]">
          Edição e transformação de imagens direto no navegador.
        </h1>

        <p className="text-zinc-600 text-lg sm:text-xl leading-relaxed max-w-[58ch] mx-auto">
          Remova fundos com inteligência artificial, aumente a resolução sem perder nitidez e adapte
          suas fotos para qualquer formato em segundos. Sem instalar nada.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={user ? "/studio" : "/login"}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-zinc-900 text-white px-6 py-3 rounded-md hover:bg-zinc-800 transition-all hover:translate-y-[-1px] active:translate-y-[0px] shadow-xs"
          >
            <span>{user ? "Acessar estúdio" : "Começar a usar"}</span>
            <ArrowRight className="size-4" />
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <Coins className="size-3.5 text-zinc-500" />
            <span>50 créditos gratuitos no cadastro</span>
          </div>
        </div>
      </section>

      {/* Seção Ferramentas & Capacidades (Espelhando a arquitetura do Studio) */}
      <section className="border-t border-zinc-200 bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          {/* 1. Ferramentas de IA em Destaque */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#09090B]">
                Processamento com Inteligência Artificial
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Modelos neurais dedicados para isolamento de objetos e aumento de resolução.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={user ? `/studio/${tool.slugs[1] || tool.slugs[0]}` : "/login"}
                  className="group relative p-5 rounded-xl border border-purple-200/80 bg-purple-50/30 hover:bg-purple-50/60 hover:border-purple-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                        <tool.icon className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 group-hover:text-purple-900 transition-colors">
                            {tool.name}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Sparkles className="size-2.5" />
                            IA
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">{tool.description}</p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold tabular-nums text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-md shrink-0">
                      {tool.credits} créditos
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-purple-700/80 pt-2 border-t border-purple-100">
                    <span>Executar no estúdio</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Filtros Artísticos e Ajustes Clássicos */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#09090B]">Filtros e Ajustes</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Efeitos visuais, refinamento de nitidez, contraste e transformações axiais.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {standardTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={user ? `/studio/${tool.slugs[1] || tool.slugs[0]}` : "/login"}
                  className="group p-3.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/70 transition-colors flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <tool.icon className={`size-4 ${tool.color}`} />
                      <span className="text-xs tabular-nums text-zinc-400">
                        {tool.credits} {tool.credits === 1 ? "crédito" : "créditos"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-zinc-900 block">{tool.name}</span>
                    <p className="text-xs text-zinc-500 line-clamp-2">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Formatos para Redes Sociais & Proporções */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#09090B]">Formatos Sociais e Dimensões</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Presets prontos com resoluções oficiais para cada plataforma.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {featuredSocials.map((format) => (
                <Link
                  key={format.id}
                  href={user ? `/studio/social/${format.slugs[1] || format.slugs[0]}` : "/login"}
                  className="p-3 border border-zinc-200 rounded-lg hover:border-zinc-300 hover:bg-zinc-50/70 transition-colors flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={format.platformIcon}
                      alt={format.platform}
                      width={16}
                      height={16}
                      className="size-4 shrink-0"
                    />
                    <span className="text-xs font-semibold text-zinc-900 truncate">
                      {format.platform}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 truncate">{format.name}</span>
                  <span className="text-xs tabular-nums text-zinc-400">
                    {format.width}x{format.height}
                  </span>
                </Link>
              ))}
            </div>

            {/* Proporções de Aspecto Rápidas */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5 mr-2">
                <Layers className="size-3.5" />
                Proporções livres:
              </span>
              {RESIZES.map((resize) => (
                <Link
                  key={resize.id}
                  href={user ? "/studio/resize" : "/login"}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-zinc-200 rounded-md bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700 transition-colors"
                >
                  <resize.icon className="size-3 text-zinc-500" />
                  <span>{resize.name}</span>
                  <span className="text-xs tabular-nums text-zinc-400">({resize.aspectRatio})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-10 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900">Kroma</span>
            <span>•</span>
            <span>Estúdio de processamento e visão computacional</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/termos" className="hover:text-zinc-900 transition-colors">
              Termos
            </Link>
            <Link href="/privacidade" className="hover:text-zinc-900 transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
