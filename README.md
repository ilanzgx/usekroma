<div align="center">
  <a id="readme-top"></a>
  <h1>Kroma</h1>
  <p>Plataforma SaaS de ponta a ponta para edição, aprimoramento e processamento de imagens alimentada por Inteligência Artificial e Visão Computacional de alta performance.</p>

  <p>
    <a href="https://github.com/ilanzgx/saas-image/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/ilanzgx/saas-image/ci.yml?branch=main&label=CI&style=flat&color=09090b" alt="CI Status" /></a>
    <a href="https://github.com/ilanzgx/saas-image/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-ISC-09090b" alt="License: ISC" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-24-09090b?logo=nodedotjs&logoColor=white" alt="Node.js 24" /></a>
    <a href="https://fastify.dev/"><img src="https://img.shields.io/badge/fastify-5.8-09090b?logo=fastify&logoColor=white" alt="Fastify 5" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/next.js-16.2-09090b?logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-19.2-09090b?logo=react&logoColor=white" alt="React 19" /></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.11-09090b?logo=python&logoColor=white" alt="Python 3.11" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/postgresql-17-09090b?logo=postgresql&logoColor=white" alt="PostgreSQL 17" /></a>
    <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/drizzle_orm-0.45-09090b?logo=drizzle&logoColor=white" alt="Drizzle ORM" /></a>
  </p>
</div>

---

## 🌟 Visão Geral

O **Kroma** é um estúdio de processamento visual construído com foco em velocidade, precisão científica e experiência do usuário refinada. Combinando uma interface de galeria minimalista e moderna com um motor especializado de visão computacional, o sistema processa imagens instantaneamente mantendo fidelidade de cores e preservação de canais de transparência.

### O que o sistema faz

- **Remoção de Fundo com IA:** Isolação e recorte de primeiro plano com canal alfa transparente usando a rede neural profunda **U2-Net**.
- **Super-Resolução Inteligente (AI Upscale):** Aumento de resolução de 2x a 4x preservando detalhes com redes convolucionais **LapSRN**.
- **Filtros Artísticos & Pictóricos:** Estilização cartoon via quantização cromática K-Means e KDTree, desenho a lápis com textura de grafite/papel e pintura a óleo com filtros direcionais de Gabor.
- **Aprimoramento & Ajustes Ópticos:** Nitidez por *Unsharp Mask*, desfoque Gaussiano, controle dinâmico de saturação cromática, conversão para escala de cinza, efeito sépia matricial e vinheta radial.
- **Transformações & Proporções Sociais:** Redimensionamento por interpolação Lanczos e catálogo pré-configurado para Instagram, TikTok, YouTube, LinkedIn, Pinterest, Twitter/X, Facebook e Twitch.
- **Streaming Binário Puro:** Zero sobrecarga de Base64 em trânsito; transferência direta de streams binários (`Blob` / `Buffer`) do worker até a memória do navegador.

---

## 🏗️ Arquitetura do Sistema

O projeto é estruturado como um **monorepo desacoplado**, separando a interface web, a orquestração de negócios e o motor numérico de computação gráfica:

```text
+-----------------------------------------------------------------------------+
|                           apps/web (Next.js 16)                             |
|          React 19, TypeScript, Tailwind CSS v4, Radix UI, Dropzone          |
+-----------------------------------------------------------------------------+
                                       |
                                       | 1. HTTP Streaming / Multipart FormData
                                       | 2. Sessão via Cookie HttpOnly (SameSite=Lax)
                                       v
+-----------------------------------------------------------------------------+
|                           apps/api (Fastify 5)                              |
|         TypeScript, Clean Architecture, Drizzle ORM, Zod, Scalar Docs       |
+-----------------------------------------------------------------------------+
           |                                                |
           | HTTP interno (Multipart)                       | SQL (postgres-js)
           | Timeout: 120s                                  | Pool: max 10
           v                                                v
+------------------------------------+    +-----------------------------------+
|      apps/worker-image             |    |          PostgreSQL 17            |
|    (Python 3.11 / FastAPI)         |    |        (Drizzle Schema)           |
|                                    |    +-----------------------------------+
|  - Concorrência: Semaphore(1)      |    | Users, Credits, Google OAuth      |
|  - U2-Net ONNX (rembg)             |    +-----------------------------------+
|  - LapSRN Super-Resolution         |
|  - OpenCV & Pillow Engine          |
|  - ThreadPool CPU-bound offload    |
+------------------------------------+
```

### Divisão de Responsabilidades

- **`apps/web` (Next.js 16 / React 19)**: Interface de estúdio interativa com componentes cliente e servidor, atuando também como **BFF (Backend-for-Frontend)**. O manipulador `/api/images/process` repassa o stream binário diretamente e isola tokens de segurança em cookies `HttpOnly`.
- **`apps/api` (Fastify 5 / TypeScript)**: Gateway de negócios e orquestrador. Gerencia autenticação Google OAuth2, emissão de JWTs (7 dias de validade), verificação de rate limits (5 req/min para imagens), validação estrita de esquemas com Zod e persistência via Drizzle ORM.
- **`apps/worker-image` (Python 3.11 / FastAPI)**: Motor de visão computacional assíncrono. Implementa semáforo de concorrência (`asyncio.Semaphore(1)`) para evitar colapsos de memória RAM (OOM), descarrega tarefas pesadas de CPU para thread pools e gerencia carregamento sob demanda (*lazy loading*) com coleta forçada de lixo (`gc.collect()`).
- **Persistência**: PostgreSQL 17 gerenciado via Drizzle ORM com pool de conexões otimizado (`postgres-js`), controle de migrações e concessão inicial de 50 créditos por cadastro.

> 📖 Para uma análise aprofundada dos fluxos de dados, diagramas C4 e decisões de engenharia, consulte o [**Documento de Arquitetura (docs/architecture.md)**](docs/architecture.md).

---

## 📁 Estrutura do Repositório

```text
saas-image/
├── apps/
│   ├── api/                      # Backend Gateway & Orquestrador (Fastify 5)
│   │   ├── src/
│   │   │   ├── config/           # Configurações de CORS, JWT, OAuth, Rate-limit
│   │   │   ├── controllers/      # Handlers HTTP (Auth, User, Image)
│   │   │   ├── database/         # Schemas Drizzle e migrações SQL
│   │   │   ├── factories/        # Composição e injeção de dependências
│   │   │   ├── middlewares/      # Interceptor de autorização JWT
│   │   │   ├── models/           # DTOs e tipos inferidos do banco
│   │   │   ├── repositories/     # Abstração de acesso a dados (Repository Pattern)
│   │   │   ├── routes/           # Rotas REST e documentação OpenAPI
│   │   │   ├── usecases/         # Casos de uso de aplicação (Clean Architecture)
│   │   │   └── server.ts         # Servidor Fastify e graceful shutdown
│   │   ├── Dockerfile            # Container de produção Node 24 Alpine
│   │   └── vitest.config.ts      # Suíte de testes unitários
│   │
│   ├── web/                      # Frontend & Camada BFF (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/              # Rotas públicas, editor Studio e handlers BFF
│   │   │   ├── components/       # Componentes acessíveis Radix UI e controles
│   │   │   ├── contexts/         # Estado global de sessão (UserContext)
│   │   │   ├── lib/              # Definições de ferramentas, aspect ratios e redes
│   │   │   ├── resources/        # Clientes de API e serviços de streaming
│   │   │   └── middleware.ts     # Proteção de rotas no Next.js
│   │   └── Dockerfile            # Container de produção Next.js Standalone
│   │
│   └── worker-image/             # Motor Científico de IA (Python 3.11 / FastAPI)
│       ├── app/
│       │   ├── processor/        # Algoritmos de visão (U2-Net, LapSRN, OpenCV)
│       │   ├── services/         # Dicionário dinâmico de despacho de operações
│       │   ├── utils/            # Decodificador de bytes para PIL/OpenCV
│       │   └── main.py           # FastAPI, semáforo de concorrência e lifecycle
│       ├── scripts/              # Utilitário de download de modelos neurais
│       └── Dockerfile            # Container com modelos U2-Net e LapSRN pré-embarcados
│
├── .github/                      # Workflows de CI/CD (Testes, Vercel e GHCR)
├── docs/                         # Especificações de arquitetura do sistema
├── docker-compose.yml            # Orquestração local completa (PostgreSQL + Apps)
├── LOCAL_DEVELOPMENT.md          # Guia passo a passo de desenvolvimento local
├── AGENTS.md                     # Guia operacional para agentes de engenharia
└── package.json                  # Orquestração de scripts do monorepo
```

---

## 💻 Stack Tecnológica

| Camada | Tecnologias Principais |
| :--- | :--- |
| **Frontend (Web)** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI, Lucide Icons, react-dropzone |
| **Backend (API)** | Fastify 5, TypeScript, Zod, fastify-type-provider-zod, @scalar/fastify-api-reference, @fastify/jwt, @fastify/oauth2 |
| **Processamento (Worker)** | Python 3.11, FastAPI, Uvicorn, OpenCV (contrib headless), Pillow, NumPy, rembg (U2-Net ONNX), LapSRN DNN, uv |
| **Banco de Dados & ORM** | PostgreSQL 17, Drizzle ORM, Drizzle Kit, postgres-js |
| **Infraestrutura & DevOps** | Docker, Docker Compose, GitHub Actions, GitHub Container Registry (GHCR), Vercel |
| **Testes & Qualidade** | Vitest (API unit tests), Ruff (Python linter), ESLint (Next.js) |

---

## 🎨 Catálogo de Ferramentas & Efeitos

| Operação | Nome na Interface | Créditos | Motor Técnico | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `remove_background` | **Remover Fundo** | 10 | U2-Net (ONNX) | Segmentação neural com canal alfa transparente de alta precisão |
| `ai_upscale` | **Aumentar Resolução** | 5 | LapSRN DNN | Super-resolução de 2x a 4x baseada em rede neural convolucional profunda |
| `cartoon` | **Cartoon** | 2 | OpenCV + SciPy | Quantização de cores por KDTree K-Means e detecção de bordas adaptativa |
| `pencil_sketch` | **Desenho a Lápis** | 2 | OpenCV + CLAHE | Color Dodge invertido, hachuras multi-angulares e microtextura de papel |
| `oil_painting` | **Pintura a Óleo** | 2 | OpenCV xphoto | Textura pictórica clássica combinada com convoluções de filtros de Gabor |
| `sharpen` | **Nitidez** | 1 | Pillow UnsharpMask | Filtro de alta frequência para realce cirúrgico de arestas e detalhes |
| `blur` | **Desfoque** | 1 | Gaussian Blur | Desfoque Gaussiano uniforme para efeitos artísticos e privacidade |
| `saturate` | **Saturação** | 1 | Pillow Enhance | Ampliação de vibração no espaço cromático com preservação tonal |
| `grayscale` | **Preto e Branco** | 1 | Luminance Map | Conversão monocromática clássica para escala de cinza |
| `sepia` | **Sépia** | 1 | Transformação Matricial | Efeito fotográfico clássico envelhecido em tons de âmbar |
| `vignette` | **Vinheta** | 1 | Gradiente Radial | Escurecimento progressivo e dramático das bordas da imagem |
| `flip_horizontal` | **Espelhar** | 1 | Transposição Axial | Inversão horizontal de orientação espacial |
| `flip_vertical` | **Inverter** | 1 | Transposição Axial | Inversão vertical de orientação espacial |
| `resize` | **Redimensionar** | 1 | Lanczos Resampling | Ajuste de dimensões exatas e adaptação para presets de redes sociais |

---

## 🚀 Desenvolvimento Local

O setup do projeto foi otimizado para inicializar em poucos minutos com Docker e pnpm.

O guia completo cobrindo pré-requisitos, configuração de ambiente, execução de serviços isolados, testes e solução de problemas está documentado em:

👉 [**Guia de Desenvolvimento Local (LOCAL_DEVELOPMENT.md)**](./LOCAL_DEVELOPMENT.md)

### Início Rápido (Quick Start)

```bash
# 1. Instalar dependências da raiz
pnpm install

# 2. Configurar variáveis da API
cp apps/api/.env.example apps/api/.env

# 3. Subir o banco de dados
docker-compose up -d database

# 4. Executar as migrações estruturais
pnpm --filter @kroma/api db:migrate

# 5. Sincronizar dependências do worker Python
cd apps/worker-image && uv sync && cd ../..

# 6. Rodar todos os serviços simultaneamente
pnpm dev
```

---

## ⚡ Comandos Disponíveis

O monorepo pode ser operado via **Task** (`task`) ou via scripts do **pnpm**:

| Ação | Via Task | Via pnpm |
| :--- | :--- | :--- |
| **Iniciar aplicações em paralelo** | `task dev` | `pnpm dev` |
| **Iniciar apenas o Frontend Web** | `task dev:web` | `pnpm start:web` |
| **Iniciar apenas a API Backend** | `task dev:api` | `pnpm start:api` |
| **Iniciar apenas o Worker Python** | `task dev:worker` | `pnpm start:worker-image` |
| **Subir banco de dados local** | `task infra:up` | `docker-compose up -d database` |
| **Parar infraestrutura local** | `task infra:down` | `docker-compose down` |
| **Executar todas as suítes de teste** | `task test` | `pnpm test` |
| **Executar testes da API (Vitest)** | `task test:api` | `pnpm --filter @kroma/api test:unit` |
| **Executar testes do Worker (pytest)** | `task test:worker` | `cd apps/worker-image && uv run pytest` |
| **Cobertura de testes da API** | `task test:coverage` | `pnpm --filter @kroma/api test:coverage` |
| **Executar linters (Web + Worker)** | `task lint` | `pnpm lint` |
| **Aplicar migrações no banco** | `task db:migrate` | `pnpm --filter @kroma/api db:migrate` |
| **Gerar novas migrações Drizzle** | `task db:generate` | `pnpm --filter @kroma/api db:generate` |
| **Abrir painel Drizzle Studio** | `task db:studio` | `pnpm start:drizzle-studio` |
| **Compilar todos os pacotes (Build)** | `task build:all` | `pnpm build` |

---

## 🚢 CI/CD & Deploy de Produção

- **Frontend (`apps/web`):** Build automatizado e deploy contínuo em produção na **Vercel** acionado a cada `push` na branch `main`.
- **Backend (`apps/api`):** Compilação TypeScript, execução de testes unitários, aplicação de migrações e publicação de contêineres Docker no **GitHub Container Registry (GHCR)** (`ghcr.io/ilanzgx/saas-image/api:latest`).
- **Worker (`apps/worker-image`):** Validação estática com Ruff e publicação de contêiner multi-stage no **GHCR** (`ghcr.io/ilanzgx/saas-image/worker-image:latest`) com modelos neurais pré-aquecidos para rápida inicialização.

---

## 📄 Licença & Autoria

Distribuído sob a licença **ISC**. Consulte o arquivo de licença para mais detalhes.

Desenvolvido por **[Ilan](https://github.com/ilanzgx)**.
