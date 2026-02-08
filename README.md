# Kroma

Plataforma SaaS para edição de imagens com IA.

## Stack

**Frontend**

- Next.js

**Backend**

- Fastify
- Drizzle ORM
- PostgreSQL

**Worker (Python)**

- FastAPI + Uvicorn
- Pillow
- NumPy

## Estrutura

```
saas-image/
├── apps/
│   ├── api/                  # API Fastify
│   │   └── src/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── database/
│   │       ├── middlewares/
│   │       ├── repositories/
│   │       ├── routes/
│   │       └── usecases/
│   │
│   ├── web/                   # Frontend (Next.js)
│   │   ├── app/
│   │   └── public/
│   │
│   └── worker-image/         # Worker Python
│       └── app/
│           ├── processor/
│           └── services/
│
├── docker-compose.yml
└── package.json
```

## Rodando o projeto

```bash
# Instalar dependências
pnpm install

# Dev (API + Worker + Web)
pnpm dev

# Apenas API (Backend Fastify)
pnpm start:api

# Apenas Worker (Backend Python)
pnpm start:worker-image

# Apenas Web (Frontend Next.js)
pnpm start:web
```

## Requisitos

- Node.js + pnpm
- Python + uv
- Docker
