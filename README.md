# Image Converter SaaS

Plataforma SaaS para manipulação de imagens.

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

# Dev (API + Worker + Drizzle Studio)
pnpm dev

# Apenas API
pnpm start:api

# Apenas Worker
pnpm start:worker-image
```

## Requisitos

- Node.js + pnpm
- Python + uv
- Docker
