# Kroma - Documentação Interna

Bem-vindo à documentação do desenvolvedor do **Kroma**.

Este guia é focado em quem está **construindo** a plataforma. Aqui você encontrará convenções, fluxos de trabalho e detalhes de arquitetura que não são públicos.

## 🚀 Quick Start (Desenvolvimento)

### 1. Setup Inicial

Se você acabou de clonar o repo:

```bash
# 1. Instalar dependências (Raiz)
pnpm install

# 2. Setup variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# (O web já tem um .env.development commitado, então deve funcionar out-of-the-box para dev)

# 3. Subir infra (Banco de dados)
docker-compose up -d database

# 4. Rodar migrações
pnpm --filter @kroma/api db:migrate

# 5. Setup do Python (Worker)
cd apps/worker-image
uv sync
```

### 2. Rodando Tudo

Para máxima produtividade, rode o comando mágico na raiz:

```bash
pnpm dev
```

Isso inicia simultaneamente:

- **API**: [http://localhost:8080](http://localhost:8080)
- **Web**: [http://localhost:3000](http://localhost:3000)
- **Worker**: [http://localhost:8000](http://localhost:8000)

---

## 🛠 Guia de Desenvolvimento

### 🐍 Worker (Python) - Processamento de Imagens

O cor do Kroma vive aqui. Lidamos com manipulação pesada de imagens usando `numpy`, `opencv` e modelos de IA.

**Como adicionar um novo Efeito:**

1. Crie a função em `apps/worker-image/app/processor/effects.py`:

   ```python
   def apply_glitch(image: Image.Image) -> Image.Image:
       # Lógica do efeito
       return processed_image
   ```

2. Registre a função no dicionário `operations` em `apps/worker-image/app/services/image_service.py`:

   ```python
   operations = {
       # ...
       "glitch": apply_glitch,
   }
   ```

3. O endpoint `/process` do worker aceita dinamicamente qualquer chave registrada nesse dicionário.
4. Atualize o frontend para enviar `operation="glitch"`.

**Nota sobre IA:**
Para efeitos pesados como `remove_background` (U2-Net), usamos um padrão de **Carregamento Lazy**. O modelo só é carregado na memória quando necessário e pode ser descarregado para economizar RAM. Veja `_get_session` e `_unload_session` em `effects.py`.

### 🔌 API (Fastify) - Backend

O backend orquestra tudo. Ele não processa imagens, apenas gerencia uploads, usuários e despacha trabalhos para o worker.

**Fluxo de Dados:**

1. Frontend envia imagem (`multipart/form-data`) para `POST /v1/images/process`.
2. API valida o usuário (JWT).
3. API encaminha bytes da imagem para o Worker via HTTP interno.
4. Worker devolve bytes processados.
5. API devolve para o Frontend.

**Banco de Dados (Drizzle ORM):**
O schema fica em `apps/api/src/database/schema/*.schema.ts`.

Para criar uma nova tabela:

1. Crie o arquivo schema.
2. Adicione ao `drizzle.config.ts` (se necessário, ou use glob pattern).
3. Gere a migration:

   ```bash
   pnpm db:generate
   ```

4. Aplique:

   ```bash
   pnpm db:migrate
   ```

### 🎨 Web (Next.js) - Frontend

Usamos Next.js 16 (App Router).

- **Componentes**: `src/components/ui` (shadcn/ui customizado).
- **Chamadas API**: Use `@/lib/api` ou `axios` diretamente, apontando para `NEXT_PUBLIC_API_URL`.
- **Estado**: Preferimos Server Components para fetch de dados iniciais e Client Components para interatividade do editor de imagem.

---

## 🧠 Decisões de Arquitetura

### Por que separar o Worker?

Processamento de imagem em Node.js bloqueia o Event Loop. Em Python, temos acesso ao ecossistema científico (NumPy, OpenCV, PyTorch/ONNX) e podemos escalar o container do worker independentemente da API. Se o processamento ficar lento, adicionamos mais workers sem mexer na API de usuários.

### Banco de Dados

Evitamos complexidade. Apenas Tabelas SQL simples.

- `users`: Autenticação e Créditos.
- `sessions`: Controle de login.
  Futuramente: `transactions` para histórico de uso.

---

## 🐛 Troubleshooting Comum

| Problema                                    | Solução                                                                                                             |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| **Erro ao conectar no Postgres**            | Verifique se o Docker está rodando `docker ps`. Se a porta 5432 estiver ocupada, mate o processo local de postgres. |
| **Worker reclama de `ModuleNotFoundError`** | Você provavelmente instalou uma lib nova mas esqueceu de rodar `uv sync` ou de ativar o venv.                       |
| **API retorna 500 no processamento**        | Verifique os logs do Worker. Geralmente é lá que o erro real acontece (falha no OpenCV, memória insuficiente, etc). |
| **CORS Error no Frontend**                  | Verifique se `NEXT_PUBLIC_API_URL` está batendo com `SERVER_PORT` da API.                                           |

---

## 📦 Scripts Úteis

| Script                    | O que faz                                                  |
| :------------------------ | :--------------------------------------------------------- |
| `pnpm start:api`          | Roda só a API isolada.                                     |
| `pnpm start:worker-image` | Roda só o Worker (útil para debugar print/logs do python). |
| `pnpm db:studio`          | Abre uma interface web para ver/editar o banco de dados.   |
