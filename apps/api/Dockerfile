# ---------- base ----------
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Install turbo globally for pruning
RUN pnpm install turbo --global
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# ---------- builder (prune) ----------
FROM base AS prune
WORKDIR /app
COPY . .
# Generate a partial monorepo with only relevant files for api
RUN turbo prune --scope=@saas-image/api --docker

# ---------- installer ----------
FROM base AS installer
WORKDIR /app

# Copy lockfile and package.jsons from prune stage
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies respected the lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code from prune stage
COPY --from=prune /app/out/full/ .

# Build the project
RUN pnpm turbo run build --filter=@saas-image/api

# ---------- runner ----------
FROM base AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app/apps/api/package.json .
COPY --from=installer /app/apps/api/dist ./dist
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 8080
CMD ["node", "dist/server.js"]