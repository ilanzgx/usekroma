# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público geral, criadores de conteúdo e profissionais autônomos que buscam ferramentas simples, rápidas e avulsas de transformação de imagem (remoção de fundo, recorte para redes sociais, aumento de resolução e ajustes de cor), sem a necessidade de instalar softwares pesados ou assumir compromisso com assinaturas mensais recorrentes.

## Product Purpose

Fornecer um estúdio de processamento de imagem direto no navegador que executa tarefas complexas de visão computacional e inteligência artificial de forma pontual e imediata. O sucesso significa o usuário fazer o upload, aplicar a transformação desejada com alta fidelidade visual em segundos e realizar o download sem atritos ou barreiras artificiais.

## Positioning

Edição pontual com cobrança justa baseada em créditos por operação. Ao contrário de plataformas tradicionais que forçam planos de assinatura recorrentes ou editores web pesados e lentos, o Kroma oferece execução assíncrona desacoplada, transporte binário puro de alta eficiência (Zero-Base64 de ponta a ponta) e uso direto sem complexidade.

## Operating Context

- Uso predominante via navegadores desktop modernos e navegadores mobile.
- Fluxo central: carregamento da imagem via arrastar e soltar (drag & drop), pré-visualização instantânea na memória volátil (`URL.createObjectURL`), seleção da ferramenta no estúdio, processamento assíncrono via worker dedicado e download em alta resolução (PNG).
- Sessões protegidas por autenticação Google OAuth com armazenamento isolado de credenciais em cookies seguros (`HttpOnly`).

## Capabilities and Constraints

- **Operações Disponíveis:**
  - Remoção de fundo inteligente com isolamento do assunto principal (10 créditos).
  - Super-resolução profunda 2x / 4x (5 créditos).
  - Filtros artísticos: Cartoon, Desenho a Lápis e Pintura a Óleo (2 créditos cada).
  - Ajustes clássicos e transformações: Nitidez, Preto e Branco, Desfocar, Saturação, Espelhar, Inverter, Sépia e Vinheta (1 crédito cada).
  - Redimensionamento e presets para proporções de redes sociais (Instagram, TikTok, YouTube, etc.).
- **Saldo e Modelo:** Concessão de 50 créditos gratuitos no cadastro para testes imediatos. Dedução por operação executada com sucesso.
- **Restrições Técnicas:**
  - Limite de upload de 5MB por arquivo.
  - Concorrência controlada no worker de processamento visual para preservação de estabilidade e memória.
  - Fluxo binário estrito sem conversão para Base64 em trânsito.

## Brand Commitments

- **Nome:** Kroma.
- **Tipografia:** Exclusivamente **Outfit**. Nunca utilizar fontes genéricas como Inter.
- **Paleta e Contraste:** Deep Ink (`#09090B`) como tom de contraste primário sobre neutros claros (`#FAFAFA`, `#FFFFFF`, tons de zinc). Nunca utilizar preto puro (`#000000`).
- **Iconografia e Elementos Visuais:** Uso estrito de ícones da biblioteca **Lucide**. Proibido o uso de emojis ou emoticons em qualquer interface ou documentação.
- **Tom de Voz:** Direto, funcional, limpo e objetivo. Foco na ferramenta e na entrega prática, eliminando jargões inflados ou discursos vazios de marketing.

## Evidence on Hand

- **Autoridade Visual e Funcional Real:** O **Kroma Studio** em `apps/web/src/app/(protected)/studio/` (Dashboard com WelcomeBanner, SocialMediaSection, ResizeSection, ToolsSection e EditorSection em tela dividida com feedback de fila e metadados de imagem).
- A página inicial (`apps/web/src/app/page.tsx`) é apenas uma porta de entrada institucional e não serve como referência estética do produto.
- Motor de visão computacional e modelos pré-treinados (U2-Net, LapSRN) em `apps/worker-image/`.
- Backend Fastify 5 com Clean Architecture, autenticação e mensageria em `apps/api/`.
- **Ausências:** Não fabricar depoimentos falsos de clientes, logos de parceiros fictícios ou métricas inventadas.

## Product Principles

1. **Utilidade Imediata:** Toda ação do usuário deve resultar em feedback claro e progresso imediato em direção ao download do arquivo final.
2. **Transparência Absoluta:** O usuário sempre sabe exatamente quanto cada operação custa antes de executá-la.
3. **Fidelidade Visual:** Preservar a resolução e qualidade original do arquivo em todas as operações em que isso for viável.
4. **Anti-Slop:** Design limpo, focado no conteúdo visual, sem ruído gráfico decorativo desnecessário ou textos apelativos.

## Accessibility & Inclusion

- Conformidade com diretrizes WCAG 2.1 nível AA para taxa de contraste entre texto e plano de fundo.
- Acessibilidade por teclado e navegação assistiva estruturada via primitivas Radix UI.
- Feedback de status assíncrono perceptível para leitores de tela em operações de processamento e upload.
