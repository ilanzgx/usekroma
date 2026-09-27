# Desenvolvimento Local

Rodar o **Kroma** localmente é simples. Este guia cobre o passo a passo detalhado para configurar o ambiente do monorepo, executar todos os serviços em conjunto ou de forma isolada, rodar testes, gerenciar migrações do banco de dados e solucionar problemas comuns.

---

## 📋 Pré-requisitos

Para rodar a plataforma na sua máquina, você precisa ter instalado:

- **Docker e Docker Compose** — orquestração do banco de dados relacional PostgreSQL 17
- **Node.js (22+)** — runtime do frontend e do backend
- **pnpm (10+)** — gerenciador de pacotes do ecossistema JavaScript e workspaces
- **Python (3.11 ou 3.12)** com **[uv](https://docs.astral.sh/uv/)** — gerenciador de pacotes e virtualenv ultra-rápido para o motor de visão computacional
- **[Task](https://taskfile.dev)** *(recomendado)* — executor de comandos unificado para o monorepo
- **Git** — controle de versão

---

## 🛠️ Instruções de Setup Passo a Passo

### 1. Clonar o Repositório

```bash
git clone https://github.com/ilanzgx/saas-image.git
cd saas-image
```

### 2. Instalar as Dependências do Monorepo

Na raiz do projeto, instale os pacotes Node.js de todos os workspaces via pnpm:

```bash
pnpm install
```

### 3. Subir a Infraestrutura (Banco de Dados)

Inicie o container do PostgreSQL 17 configurado no `docker-compose.yml`:

```bash
task infra:up

# Ou diretamente via docker-compose:
docker-compose up -d database
```

Para confirmar se o banco subiu com sucesso e está saudável:

```bash
docker compose ps
# ou:
docker ps
```

### 4. Configurar as Variáveis de Ambiente

#### Backend (`apps/api`)
Copie o arquivo de exemplo para o diretório da API:

```bash
cp apps/api/.env.example apps/api/.env
```

Edite o arquivo `apps/api/.env` com as configurações para o ambiente de desenvolvimento local:

```env
# Configurações do Servidor Fastify
SERVER_HOST=0.0.0.0
SERVER_PORT=8080
NODE_ENV=development
LOG_LEVEL=info

# Conexão com o PostgreSQL Local
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# Autenticação Google OAuth2
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/v1/auth/google/callback

# Criptografia de Sessão JWT (qualquer string segura com 32+ caracteres)
JWT_SECRET=kroma_jwt_secret_desenvolvimento_local_2026_super_seguro

# Comunicação Interna com o Worker
WORKER_IMAGE_URL=http://localhost:8000

# URL do Frontend (para validação de CORS e redirecionamento de OAuth)
FRONTEND_URL=http://localhost:3000
```

> 💡 **Nota sobre Google OAuth2:** Para testar o login social localmente, crie credenciais OAuth 2.0 no [Google Cloud Console](https://console.cloud.google.com/), adicionando `http://localhost:8080/v1/auth/google/callback` aos URIs de redirecionamento autorizados.

#### Frontend (`apps/web`)
O frontend já conta com um arquivo `apps/web/.env.development` comissionado e pré-configurado:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000/v1
```

### 5. Executar as Migrações do Banco de Dados

Com o container do PostgreSQL em execução, aplique as migrações estruturais para criar a tabela de usuários e saldo de créditos:

```bash
task db:migrate

# Ou via pnpm:
pnpm --filter @kroma/api db:migrate
```

### 6. Configurar o Ambiente do Worker Python & Modelos de IA

Acesse o diretório do worker, sincronize o ambiente virtual com o `uv` e execute o script para baixar os modelos de super-resolução:

```bash
cd apps/worker-image

# Sincroniza o venv e instala todas as dependências do pyproject.toml
uv sync

# Baixa os modelos LapSRN (x2 e x4) necessários para o AI Upscale
uv run python scripts/download_models.py

# Retorne para a raiz do repositório
cd ../..
```

> ℹ️ O modelo **U2-Net** para remoção de fundo é baixado automaticamente pelo pacote `rembg` na primeira execução de teste da ferramenta caso ainda não esteja presente no cache da máquina (`~/.u2net/`).

### 7. Iniciar Todas as Aplicações em Paralelo

Para máxima produtividade, execute:

```bash
task dev

# Ou via pnpm:
pnpm dev
```

Esse comando utiliza `concurrently` para disparar os três serviços simultaneamente em um único terminal com logs identificados por cores:
- 🟣 **WORKER** (Python / FastAPI)
- 🔵 **API** (Fastify / TypeScript)
- 🟢 **WEB** (Next.js 16 / React 19)

---

## 🌐 Serviços & Portas Disponíveis

Com o ambiente em execução, os seguintes pontos de acesso estarão disponíveis:

| Serviço | URL / Porta | Descrição |
| :--- | :--- | :--- |
| **Frontend Web** | [`http://localhost:3000`](http://localhost:3000) | Interface do usuário e Estúdio de edição de imagens |
| **API Backend** | [`http://localhost:8080`](http://localhost:8080) | Servidor Fastify e endpoints REST |
| **Documentação OpenAPI (Scalar)** | [`http://localhost:8080/docs`](http://localhost:8080/docs) | Interface interativa de testes dos endpoints da API |
| **Health Check API** | [`http://localhost:8080/health`](http://localhost:8080/health) | Status da API e teste de conexão ativa com o banco |
| **Worker Image** | [`http://localhost:8000`](http://localhost:8000) | Motor FastAPI de computação visual e inferência de IA |
| **Health Check Worker** | [`http://localhost:8000/health`](http://localhost:8000/health) | Diagnóstico e probe de saúde do worker |
| **Drizzle Studio (Opcional)** | [`http://localhost:4983`](http://localhost:4983) | Painel visual para consultar e editar o PostgreSQL |
| **PostgreSQL 17** | `localhost:5432` | Banco relacional (`postgres` / `postgres`) |

---

## 🕹️ Executando Serviços de Forma Isolada

Se você estiver atuando em apenas uma camada da aplicação, pode rodar cada serviço de forma independente:

### Backend API (Fastify / TypeScript)

```bash
pnpm start:api

# Ou diretamente pelo workspace da API:
cd apps/api && pnpm dev
```
> Executa com `tsx watch`, recarregando automaticamente a cada alteração de código.

### Frontend Web (Next.js 16 / React 19)

```bash
pnpm start:web

# Ou diretamente pelo workspace web:
cd apps/web && pnpm dev
```
> Disponível em `http://localhost:3000` com suporte nativo a Fast Refresh.

### Worker de Imagens (Python 3.11 / FastAPI)

```bash
pnpm start:worker-image

# Ou diretamente pelo uv:
cd apps/worker-image && uv run uvicorn app.main:app --reload --port 8000
```
> O parâmetro `--reload` monitora e recarrega os módulos Python automaticamente a cada edição de arquivo.

### Drizzle Studio (Interface Visual do Banco)

```bash
pnpm start:drizzle-studio

# Ou via workspace:
cd apps/api && pnpm db:studio
```
> Abre uma interface web no navegador para visualizar e editar os registros das tabelas diretamente.

---

## 🧪 Fluxo de Desenvolvimento & Testes

### Executando Testes Automatizados

Os testes do backend são executados com **Vitest**:

```bash
# Executa todos os testes da API
pnpm --filter @kroma/api test

# Executa especificamente a suíte de testes unitários
pnpm --filter @kroma/api test:unit

# Executa os testes no modo watch contínuo
pnpm --filter @kroma/api test:watch

# Gera relatório de cobertura de código
pnpm --filter @kroma/api test:coverage

# Abre a interface gráfica interativa do Vitest
pnpm --filter @kroma/api test:ui
```

### Análise Estática & Linting

```bash
# Linter ultra-rápido no Worker Python via Ruff
cd apps/worker-image && uv run ruff check .

# Linter do Frontend Next.js via ESLint
pnpm --filter @kroma/web lint
```

### Evolução do Banco de Dados com Drizzle

Sempre que alterar ou adicionar novas tabelas em `apps/api/src/database/schema/`:

1. **Gere o arquivo de migração SQL:**
   ```bash
   pnpm --filter @kroma/api db:generate
   ```
2. **Aplique a migração no banco de dados local:**
   ```bash
   pnpm --filter @kroma/api db:migrate
   ```
3. **(Opcional) Sincronização direta em prototipagem rápida:**
   ```bash
   pnpm --filter @kroma/api db:push
   ```

---

## 🎨 Como Adicionar um Novo Efeito de Imagem

Para criar e plugar uma nova ferramenta no ecossistema:

### 1. Implementar a Função no Worker
Em `apps/worker-image/app/processor/effects.py`, crie a função de processamento:
```python
def apply_glitch(image: Image.Image) -> Image.Image:
    # Lógica de manipulação com OpenCV, NumPy ou Pillow
    return processed_image
```

### 2. Registrar no Despachante do Worker
Em `apps/worker-image/app/services/image_service.py`, adicione a chave correspondente:
```python
operations = {
    # ...
    "glitch": apply_glitch,
}
```

### 3. Registrar a Ferramenta no Frontend
Em `apps/web/src/lib/tools.ts`, adicione a nova ferramenta ao array `TOOLS`:
```typescript
{
  id: "glitch",
  slugs: ["glitch", "efeito-glitch"],
  name: "Glitch Art",
  description: "Aplica distorção digital artística na imagem.",
  icon: Sparkles,
  color: "text-rose-500",
  operation: "glitch",
  credits: 2,
  seo: {
    title: "Efeito Glitch em Imagens Online - Kroma",
    description: "Crie arte digital com distorções de glitch instantaneamente.",
    keywords: ["glitch", "glitch effect", "arte digital"],
  },
}
```
A nova ferramenta estará automaticamente disponível no menu, nas rotas dinâmicas `/studio/glitch` e no editor interativo.

---

## 🔍 Resolução de Problemas Comuns (Troubleshooting)

### 1. Erro ao conectar no PostgreSQL (`ECONNREFUSED` na porta 5432)
- **Causa:** O container do PostgreSQL não está rodando ou uma instância local do Postgres no seu sistema operacional já está ocupando a porta 5432.
- **Solução:**
  ```bash
  # Verifique o status do container
  docker compose ps

  # Se houver outro Postgres rodando nativamente no Windows/Linux, pare o serviço local ou ajuste o mapeamento de porta no docker-compose.yml.
  docker-compose up -d database
  ```

### 2. Worker Python acusa `ModuleNotFoundError`
- **Causa:** Novas dependências foram adicionadas no `pyproject.toml`, mas o ambiente virtual local não foi sincronizado.
- **Solução:**
  ```bash
  cd apps/worker-image
  uv sync
  ```

### 3. Modelos de Super-Resolução não encontrados (`FileNotFoundError`)
- **Causa:** Os arquivos `LapSRN_x2.pb` e `LapSRN_x4.pb` ainda não foram baixados no diretório do usuário (`~/.sr_models/`).
- **Solução:**
  ```bash
  cd apps/worker-image
  uv run python scripts/download_models.py
  ```

### 4. API retorna erro 500 no processamento de imagens
- **Causa:** Falha interna de execução em operações do OpenCV ou estouro de limites no worker.
- **Solução:**
  - Inspecione a janela de console do terminal onde o worker está rodando. As mensagens com tags `[U2-NET]`, `[LapSRN]` ou `[ERROR]` exibirão o rastreamento exato do erro.
  - Verifique se a imagem enviada respeita o limite máximo de 5MB e formatos aceitos (PNG, JPG, WebP).

### 5. Erro 503 "Servidor ocupado"
- **Causa:** O worker possui um semáforo estrito (`asyncio.Semaphore(1)`) que limita o processamento a 1 imagem por vez para evitar esgotamento de memória RAM. Se uma imagem anterior demorar mais de 30 segundos para ser processada, o semáforo rejeita novas entradas.
- **Solução:** Aguarde a conclusão da imagem em andamento ou utilize imagens de menor resolução.

### 6. Erro de CORS no Frontend
- **Causa:** Divergência entre `NEXT_PUBLIC_API_URL` configurado no frontend e `SERVER_PORT` da API.
- **Solução:** Certifique-se de que a API está rodando na porta 8080 e que `apps/web/.env.development` aponta exatamente para `http://localhost:8080/v1`.
