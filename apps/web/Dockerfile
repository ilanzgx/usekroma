# ---------- base ----------
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install turbo --global
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# ---------- builder (prune) ----------
FROM base AS prune
WORKDIR /app
COPY . .
# Generate a partial monorepo with only relevant files for web
RUN turbo prune --scope=@saas-image/web --docker

# ---------- installer ----------
FROM base AS installer
WORKDIR /app

# Copy lockfile and package.jsons from prune stage
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code from prune stage
COPY --from=prune /app/out/full/ .

# Build the project
RUN pnpm turbo run build --filter=@saas-image/web

# ---------- runner ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public

# Set the correct permission for prune/cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: standalone output moves the server.js to the root relative to the standalone folder
CMD ["node", "apps/web/server.js"]