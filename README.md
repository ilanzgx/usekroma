<div align="center">
  <a id="readme-top"></a>
  <h1>Kroma</h1>
  <p>Plataforma SaaS de ponta a ponta para edicao, aprimoramento e processamento de imagens alimentada por Inteligencia Artificial e Visao Computacional de alta performance.</p>

  <p>
    <a href="https://github.com/ilanzgx/usekroma/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/ilanzgx/usekroma/ci.yml?branch=main&label=CI&logo=githubactions&logoColor=white" alt="CI Status" /></a>
    <a href="https://github.com/ilanzgx/usekroma/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-blue?style=flat&logo=gnu&logoColor=white" alt="License: GPL-3.0" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-24-339933?logo=nodedotjs&logoColor=white" alt="Node.js 24" /></a>
    <a href="https://fastify.dev/"><img src="https://img.shields.io/badge/fastify-5.8-000000?logo=fastify&logoColor=white" alt="Fastify 5" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/next.js-16.2-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-19.2-20232A?logo=react&logoColor=61DAFB" alt="React 19" /></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.11-3776AB?logo=python&logoColor=white" alt="Python 3.11" /></a>
    <a href="https://www.rabbitmq.com/"><img src="https://img.shields.io/badge/rabbitmq-3.13-FF6600?logo=rabbitmq&logoColor=white" alt="RabbitMQ 3.13" /></a>
    <a href="https://min.io/"><img src="https://img.shields.io/badge/minio-s3-C72C48?logo=minio&logoColor=white" alt="MinIO S3" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/postgresql-17-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 17" /></a>
    <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/drizzle_orm-0.45-C5F74F?logo=drizzle&logoColor=black" alt="Drizzle ORM" /></a>
  </p>
</div>

---

## Visao Geral

O **Kroma** e um estudio de processamento visual construido com foco em velocidade, precisao cientifica e experiencia do usuario refinada. Combinando uma interface de galeria minimalista e moderna com um motor especializado de visao computacional e uma arquitetura orientada a eventos assincrona, o sistema processa transformacoes intensivas mantendo estabilidade operacional, fidelidade de cores e preservacao de canais de transparencia.

### O que o sistema faz

- **Remocao de Fundo com IA:** Isolamento e recorte de primeiro plano com canal alfa transparente usando a rede neural profunda **U2-Net**.
- **Super-Resolucao Inteligente (AI Upscale):** Aumento de resolucao de 2x a 4x preservando detalhes com redes convolucionais **LapSRN**.
- **Filtros Artisticos & Pictoricos:** Estilizacao cartoon via quantizacao cromatica K-Means e KDTree, desenho a lapis com textura de grafite/papel e pintura a oleo com filtros direcionais de Gabor.
- **Aprimoramento & Ajustes Opticos:** Nitidez por _Unsharp Mask_, desfoque Gaussiano, controle dinamico de saturacao cromatica, conversao para escala de cinza, efeito sepia matricial e vinheta radial.
- **Transformacoes & Proporcoes Sociais:** Redimensionamento por interpolacao Lanczos e catalogo pre-configurado para Instagram, TikTok, YouTube, LinkedIn, Pinterest, Twitter/X, Facebook e Twitch.
- **Pipeline Assincrono com Mensageria & S3:** Desacoplamento total entre ingestao e computacao visual utilizando **RabbitMQ** e **MinIO (S3)**, com respostas HTTP 202 Accepted, acompanhamento de progresso e estorno automatico de creditos em caso de falha.
- **Streaming Binario Puro:** Zero sobrecarga de Base64 em transito; transferencia direta de streams binarios (`Blob` / `Buffer` / `image/png`) do storage ate a memoria do navegador.

---

## Arquitetura do Sistema

O projeto e estruturado como um **monorepo desacoplado e orientado a eventos**, separando a interface web, o gateway de orquestracao, as filas de mensageria, o armazenamento de objetos e o motor numerico de computacao grafica:

```text
+-----------------------------------------------------------------------------+
|                           apps/web (Next.js 16)                             |
|          React 19, TypeScript, Tailwind CSS v4, Radix UI, Dropzone          |
+-----------------------------------------------------------------------------+
                                       |
                                       | 1. POST /api/images/process (Multipart)
                                       | 2. Retorno imediato: 202 Accepted { jobId }
                                       | 3. Polling: GET /api/jobs/[id]
                                       | 4. Download: GET /api/jobs/[id]/result
                                       v
+-----------------------------------------------------------------------------+
|                           apps/api (Fastify 5)                              |
|         TypeScript, Clean Architecture, Drizzle ORM, Zod, Scalar Docs       |
+-----------------------------------------------------------------------------+
         |                        |                                   |
         | Upload entrada         | 1. Cria Job (pending)             | Publica Job
         | Download resultado     | 2. Debita creditos                | (AMQP 0-9-1)
         v                        v                                   v
+------------------+    +-------------------+               +------------------+
|   MinIO / S3     |    |   PostgreSQL 17   |               |   RabbitMQ 3     |
| (pgsty/silo)     |    | (Drizzle Schema)  |               | (Message Broker) |
+------------------+    +-------------------+               +------------------+
| uploads/{jobId}  |    | - users           |                     |          ^
| results/{jobId}  |    | - jobs            |                     |          |
+------------------+    +-------------------+                     |          |
         ^                                                        |          |
         | Download imagem original                               |          |
         | Upload imagem processada                               v          |
+--------------------------------------------------------------------+       |
|                 apps/worker-image (Python 3.11)                    |       |
|             FastAPI, aio-pika, aiobotocore, OpenCV, PIL            |       |
|                                                                    |       |
|  - Fila image-processing (prefetch: 1) ----------------------------+       |
|  - Fila image-results (publica status completed/failed) --------------------+
|  - Concorrencia estrita via ThreadPool & isolamento de memoria     |
|  - U2-Net ONNX (rembg) & LapSRN Super-Resolution                   |
|  - Coleta forcada de lixo (gc.collect) no final de cada execucao   |
+--------------------------------------------------------------------+
```

### Divisao de Responsabilidades

- **`apps/web` (Next.js 16 / React 19)**: Interface de estudio interativa e camada **BFF (Backend-for-Frontend)**. O manipulador `/api/images/process` encaminha o arquivo para a API, recebe resposta `202 Accepted` com `jobId`, consulta status via `/api/jobs/[id]` e consome o stream binario final via `/api/jobs/[id]/result` mantendo tokens em cookies `HttpOnly`.
- **`apps/api` (Fastify 5 / TypeScript)**: Gateway de negocios e orquestrador assincrono. Autentica via Google OAuth2, gerencia saldos e creditos de usuarios, armazena payloads brutos no MinIO S3 (`uploads/*`), persiste jobs no PostgreSQL e publica tarefas na fila `image-processing`. Possui um consumidor integrado (`ResultsConsumer`) que escuta a fila `image-results` para atualizar status e estornar creditos em caso de falha.
- **`apps/worker-image` (Python 3.11 / FastAPI)**: Consumidor de tarefas assincrono baseado em `aio-pika`. Consome a fila com `prefetch_count=1`, faz download do binario a partir do MinIO S3, executa algoritmos pesados de visao em ThreadPool (`loop.run_in_executor`), envia a imagem gerada de volta ao bucket S3 (`results/*`), publica evento de conclusao na fila `image-results` e executa `gc.collect()`.
- **`RabbitMQ`**: Message Broker AMQP 0-9-1 responsavel pelo enfileiramento duravel e distribuicao justa entre consumidores, garantindo resiliencia e protecao contra mensagens envenenadas (redelivery check).
- **`MinIO / S3 Storage`**: Armazenamento de objetos de alta performance (`pgsty/silo`), desacoplando o trafego binario do banco relacional e da memoria do RabbitMQ.
- **`PostgreSQL 17`**: Persistencia relacional via Drizzle ORM com pool `postgres-js`, mantendo tabelas `users` (creditos, autenticacao) e `jobs` (ciclo de vida, parametros, referencias S3 e timestamps).

Para uma analise aprofundada dos fluxos de dados, diagramas C4 e decisoes de engenharia, consulte o [**Documento de Arquitetura (docs/architecture.md)**](docs/architecture.md).

---

## Estrutura do Repositorio

```text
saas-image/
├── apps/
│   ├── api/                      # Backend Gateway & Orquestrador (Fastify 5)
│   │   ├── src/
│   │   │   ├── config/           # Configuracoes de CORS, JWT, OAuth, S3, RabbitMQ
│   │   │   ├── controllers/      # Handlers HTTP (Auth, User, Image, Job)
│   │   │   ├── database/         # Schemas Drizzle e migracoes SQL (users, jobs)
│   │   │   ├── factories/        # Composicao e injecao de dependencias
│   │   │   ├── lib/              # Modulos de infraestrutura (queue, storage, results-consumer)
│   │   │   ├── middlewares/      # Interceptor de autorizacao JWT
│   │   │   ├── models/           # DTOs e tipos inferidos do banco
│   │   │   ├── repositories/     # Abstracao de acesso a dados (Repository Pattern)
│   │   │   ├── routes/           # Rotas REST e documentacao OpenAPI (/v1/images, /v1/jobs)
│   │   │   ├── usecases/         # Casos de uso de aplicacao (Clean Architecture)
│   │   │   └── server.ts         # Servidor Fastify, conexoes e graceful shutdown
│   │   ├── Dockerfile            # Container de producao Node 24 Alpine
│   │   └── vitest.config.ts      # Suite de testes unitarios
│   │
│   ├── web/                      # Frontend & Camada BFF (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/              # Rotas publicas, editor Studio e handlers BFF (/api/jobs)
│   │   │   ├── components/       # Componentes acessiveis Radix UI e controles
│   │   │   ├── contexts/         # Estado global de sessao (UserContext)
│   │   │   ├── lib/              # Definicoes de ferramentas, aspect ratios e redes
│   │   │   ├── resources/        # Clientes de API, polling assincrono e streaming
│   │   │   └── middleware.ts     # Protecao de rotas no Next.js
│   │   └── Dockerfile            # Container de producao Next.js Standalone
│   │
│   └── worker-image/             # Motor Cientifico & Consumidor (Python 3.11 / FastAPI)
│       ├── app/
│       │   ├── processor/        # Algoritmos de visao (U2-Net, LapSRN, OpenCV)
│       │   ├── services/         # Imagem service e despacho de operacoes
│       │   ├── utils/            # Decodificador de bytes e cliente S3 (storage.py)
│       │   ├── consumer.py       # Consumidor de fila RabbitMQ via aio-pika
│       │   └── main.py           # Servidor FastAPI e inicializacao do consumidor
│       ├── scripts/              # Utilitario de download de modelos neurais
│       └── Dockerfile            # Container com modelos U2-Net e LapSRN pre-embarcados
│
├── packages/
│   └── shared/                   # Contratos TypeScript compartilhados (@kroma/shared)
│       └── src/types/            # Tipos de usuarios, operacoes de imagem e jobs
│
├── .github/                      # Workflows de CI/CD (Testes, Vercel e GHCR)
├── docs/                         # Especificacoes de arquitetura do sistema
├── docker-compose.yml            # Orquestracao de servicos (PostgreSQL, RabbitMQ, MinIO)
├── LOCAL_DEVELOPMENT.md          # Guia passo a passo de desenvolvimento local
├── AGENTS.md                     # Guia operacional para agentes de engenharia
└── package.json                  # Orquestracao de scripts do monorepo
```

---

## Stack Tecnologica

| Camada                      | Tecnologias Principais                                                                                                                                           |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend (Web & BFF)**    | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI, Lucide Icons, react-dropzone                                                           |
| **Backend (API Gateway)**   | Fastify 5, TypeScript, Zod, fastify-type-provider-zod, amqp-connection-manager, @aws-sdk/client-s3, @scalar/fastify-api-reference, @fastify/jwt, @fastify/oauth2 |
| **Processamento (Worker)**  | Python 3.11, FastAPI, Uvicorn, aio-pika (AMQP), aiobotocore (S3), OpenCV (contrib headless), Pillow, NumPy, rembg (U2-Net ONNX), LapSRN DNN, uv                  |
| **Mensageria & Filas**      | RabbitMQ 3.13 (AMQP 0-9-1 com conexoes persistentes e prefetch throttling)                                                                                       |
| **Object Storage (S3)**     | MinIO / Silo (S3-compatible bucket `kroma-storage`)                                                                                                              |
| **Banco de Dados & ORM**    | PostgreSQL 17, Drizzle ORM, Drizzle Kit, postgres-js                                                                                                             |
| **Infraestrutura & DevOps** | Docker, Docker Compose, GitHub Actions, GitHub Container Registry (GHCR), Vercel                                                                                 |
| **Testes & Qualidade**      | Vitest (API unit tests), Pytest + HTTPX (Worker tests), Ruff (Python linter), ESLint (Next.js)                                                                   |

---

## Catalogo de Ferramentas & Efeitos

| Operacao            | Nome na Interface      | Creditos | Motor Tecnico           | Descricao                                                                |
| :------------------ | :--------------------- | :------: | :---------------------- | :----------------------------------------------------------------------- |
| `remove_background` | **Remover Fundo**      |    10    | U2-Net (ONNX)           | Segmentacao neural com canal alfa transparente de alta precisao          |
| `ai_upscale`        | **Aumentar Resolucao** |    5     | LapSRN DNN              | Super-resolucao de 2x a 4x baseada em rede neural convolucional profunda |
| `cartoon`           | **Cartoon**            |    2     | OpenCV + SciPy          | Quantizacao de cores por KDTree K-Means e deteccao de bordas adaptativa  |
| `pencil_sketch`     | **Desenho a Lapis**    |    2     | OpenCV + CLAHE          | Color Dodge invertido, hachuras multi-angulares e microtextura de papel  |
| `oil_painting`      | **Pintura a Oleo**     |    2     | OpenCV xphoto           | Textura pictorica classica combinada com convolucoes de filtros de Gabor |
| `sharpen`           | **Nitidez**            |    1     | Pillow UnsharpMask      | Filtro de alta frequencia para realce cirurgico de arestas e detalhes    |
| `blur`              | **Desfoque**           |    1     | Gaussian Blur           | Desfoque Gaussiano uniforme para efeitos artisticos e privacidade        |
| `saturate`          | **Saturacao**          |    1     | Pillow Enhance          | Ampliacao de vibracao no espaco cromatico com preservacao tonal          |
| `grayscale`         | **Preto e Branco**     |    1     | Luminance Map           | Conversao monocromatica classica para escala de cinza                    |
| `sepia`             | **Sepia**              |    1     | Transformacao Matricial | Efeito fotografico classico envelhecido em tons de ambar                 |
| `vignette`          | **Vinheta**            |    1     | Gradiente Radial        | Escurecimento progressivo e dramatico das bordas da imagem               |
| `flip_horizontal`   | **Espelhar**           |    1     | Transposicao Axial      | Inversao horizontal de orientacao espacial                               |
| `flip_vertical`     | **Inverter**           |    1     | Transposicao Axial      | Inversao vertical de orientacao espacial                                 |
| `resize`            | **Redimensionar**      |    1     | Lanczos Resampling      | Ajuste de dimensoes exatas e adaptacao para presets de redes sociais     |

---

## Desenvolvimento Local

O setup do projeto foi otimizado para inicializar em poucos minutos com Docker, pnpm e uv.

O guia completo cobrindo pre-requisitos, configuracao de ambiente, execucao de servicos isolados, testes e solucao de problemas esta documentado em:

[**Guia de Desenvolvimento Local (LOCAL_DEVELOPMENT.md)**](./LOCAL_DEVELOPMENT.md)

### Inicio Rapido (Quick Start)

```bash
# 1. Instalar dependencias da raiz
pnpm install

# 2. Configurar variaveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/worker-image/.env.example apps/worker-image/.env
cp apps/web/.env.example apps/web/.env

# 3. Subir infraestrutura local (PostgreSQL, RabbitMQ, MinIO)
task infra:up
# ou alternativamente: docker compose up -d postgres rabbitmq minio

# 4. Executar as migracoes estruturais do banco de dados
pnpm --filter @kroma/api db:migrate

# 5. Sincronizar dependencias do worker Python
cd apps/worker-image && uv sync && cd ../..

# 6. Rodar todos os servicos simultaneamente
task dev
# ou alternativamente: pnpm dev
```

---

## Comandos Disponiveis

O monorepo pode ser operado via **Task** (`task`) ou via scripts do **pnpm**:

| Acao                                          | Via Task             | Via pnpm                                       |
| :-------------------------------------------- | :------------------- | :--------------------------------------------- |
| **Iniciar aplicacoes em paralelo**            | `task dev`           | `pnpm dev`                                     |
| **Iniciar apenas o Frontend Web**             | `task dev:web`       | `pnpm start:web`                               |
| **Iniciar apenas a API Backend**              | `task dev:api`       | `pnpm start:api`                               |
| **Iniciar apenas o Worker Python**            | `task dev:worker`    | `pnpm start:worker-image`                      |
| **Subir infraestrutura local (DB, Fila, S3)** | `task infra:up`      | `docker compose up -d postgres rabbitmq minio` |
| **Subir todos os containers (Apps + Infra)**  | `task infra:all`     | `docker compose up -d --build`                 |
| **Parar infraestrutura local**                | `task infra:down`    | `docker compose down`                          |
| **Logs da infraestrutura**                    | `task infra:logs`    | `docker compose logs -f`                       |
| **Executar todas as suites de teste**         | `task test`          | `pnpm test`                                    |
| **Executar testes da API (Vitest)**           | `task test:api`      | `pnpm --filter @kroma/api test:unit`           |
| **Executar testes do Worker (pytest)**        | `task test:worker`   | `cd apps/worker-image && uv run pytest`        |
| **Cobertura de testes da API**                | `task test:coverage` | `pnpm --filter @kroma/api test:coverage`       |
| **Executar linters (Web + Worker)**           | `task lint`          | `pnpm lint`                                    |
| **Aplicar migracoes no banco**                | `task db:migrate`    | `pnpm --filter @kroma/api db:migrate`          |
| **Gerar novas migracoes Drizzle**             | `task db:generate`   | `pnpm --filter @kroma/api db:generate`         |
| **Abrir painel Drizzle Studio**               | `task db:studio`     | `pnpm start:drizzle-studio`                    |
| **Compilar pacote compartilhado**             | `task build:shared`  | `pnpm --filter @kroma/shared build`            |
| **Compilar todos os pacotes (Build)**         | `task build:all`     | `pnpm build`                                   |

---

## CI/CD & Pipeline de Integracao

- **Frontend (`apps/web`):** Validacao de tipagem TypeScript, analise estatica com ESLint e compilacao Next.js.
- **Backend (`apps/api`):** Verificacao TypeScript, execucao da suite de testes unitarios via Vitest e build de producao com lockfile estrito.
- **Worker (`apps/worker-image`):** Sincronizacao de ambiente via `uv`, analise estatica de codigo com Ruff e suite de testes do consumidor e processadores com Pytest.
- **Conteineres e Releases:** Publicacao paralela de imagens Docker no GitHub Container Registry (`ghcr.io`) disparada exclusivamente na criacao de tags de versao (`v*`) ou via acionamento manual (`workflow_dispatch`).

---

## Licenca & Autoria

Distribuido sob a licenca **GNU General Public License v3.0 (GPL-3.0)**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

Desenvolvido por **[Ilan](https://github.com/ilanzgx)**.
