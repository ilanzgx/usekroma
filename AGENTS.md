# AGENTS.md

## 1. Project Overview & Core Purpose

**Kroma** is an AI-powered SaaS platform for image transformation, enhancement, and computer vision operations.

The platform processes raster images through neural models and computer vision pipelines:
- **Neural Image Manipulation:** Background removal via U2-Net, AI super-resolution (LapSRN x2 and x4 via OpenCV DNN), artistic filters (cartoon, pencil sketch, oil painting).
- **Computer Vision Operations:** Dynamic resizing, format conversions, directional flips, blur, sepia, grayscale, saturation, and unsharp masking.
- **Zero-Base64 Binary Streaming:** Pure binary pipeline across all layers (multipart uploads -> Node.js Buffer -> Python raw bytes -> Next.js Blob proxy -> browser ObjectURL).
- **BFF Architecture:** Next.js App Router serves as both the Web client and Backend-For-Frontend (BFF), forwarding multipart payloads to the Fastify API with HttpOnly session verification.
- **Credit-Based Ledger:** PostgreSQL ledger tracking user quotas and deductions per AI processing invocation.

---

## 2. Hard Rules

- **AVOID unnecessary comments**. Match the surrounding file's conventions: naming, comment density, module structure. Comments explain why, never restate what.
- **NEVER run backend or frontend dev servers manually.** The human runs their own environment or uses Taskfile.
- **NO NestJS in backend.** The API is strictly Fastify 5 organized under Clean Architecture (Controllers -> UseCases -> Repositories).
- **NO Base64 in image transport.** Images must flow as raw binary buffers and blobs (image/png).
- **NO emojis or emoticons anywhere** in user interfaces or system documentation.
- **NO Inter font.** The UI typography strictly mandates Outfit.
- **NO pure black (#000000).** Dark contrast tone is Deep Ink (#09090B).
- **ALWAYS keep docs/architecture.md updated** when changing endpoints, database schemas, image operations, or infrastructure configs.
- **Docker build context is always the monorepo root (context: .)** due to @kroma/shared workspace dependencies.
- **NEVER delete existing tests.** Add or update tests for any code you change.
- **NO overengineering.** Always prioritize simplicity and maintainability over speculative abstraction.

---

## 3. Technology Stack

- **Backend API & Gateway:** Fastify 5.8, Node.js 22, TypeScript 5.8
- **API Architecture:** Clean Architecture (Routes -> Controllers -> UseCases -> Repositories -> Drizzle ORM)
- **Vision & AI Compute Node:** FastAPI 0.115, Python 3.11, OpenCV 4.11 (cv2), U2-Net (rembg), LapSRN (cv2.dnn_superres), Pillow (PIL), NumPy
- **Frontend & BFF Layer:** Next.js 16.2 (App Router), React 19.2, Tailwind CSS v4, Radix UI, Lucide Icons, react-dropzone
- **Shared Contracts Package:** @kroma/shared (TypeScript DTOs, image operation enums, request/response contracts)
- **Database & Persistence:** PostgreSQL 17, Drizzle ORM 0.38, Drizzle Kit, pg driver
- **Authentication & Security:** Google OAuth2 (Authorization Code Flow), signed JWT (7 days, jose), HttpOnly cookies (SameSite=Lax, Secure), @fastify/rate-limit, @fastify/multipart
- **API Documentation:** Scalar OpenAPI UI (@scalar/fastify-api-reference), @fastify/swagger
- **Testing & Quality:** Vitest (unit and usecase tests on API), Pytest + HTTPX (unit and processor tests on Worker), ESLint 9, Ruff
- **Monorepo & Task Automation:** pnpm workspaces (Node/TS), uv workspaces (Python), Task (Taskfile.yml), Docker, Docker Compose

---

## 4. Architecture Quick Reference

Detailed diagrams, schemas, and sequence flows are documented in docs/architecture.md.

- **`apps/api` (Fastify 5.8 / TypeScript / Node.js 22):** API gateway, OAuth2 flow, JWT issuance, rate limiting, and PostgreSQL persistence via Drizzle ORM. Runs on port 8080. Scalar OpenAPI docs at /docs.
- **`apps/worker-image` (FastAPI 0.115 / Python 3.11):** Computer vision compute node using OpenCV, U2-Net, and LapSRN. Concurrency is throttled via asyncio.Semaphore(1). Runs on port 8000.
- **`apps/web` (Next.js 16.2 / React 19.2 / Tailwind CSS v4):** Web studio interface and BFF streaming proxy. Consumes binary buffers into URL.createObjectURL. Runs on port 3000.
- **`packages/shared` (@kroma/shared):** Shared TypeScript contracts, DTOs, and image operation enums consumed by apps/api and apps/web.
- **`database` (PostgreSQL 17):** Core table users storing user profile, Google OAuth ID, and operational credit balance. Runs on port 5432.

---

## 5. Image Processing & Concurrency Rules

1. **Worker Concurrency Limit (OOM Prevention):**
   - Strictly 1 image processed at a time via asyncio.Semaphore(1).
   - SEMAPHORE_TIMEOUT = 30 seconds (returns HTTP 503 if queue is full).
   - PROCESSING_TIMEOUT = 120 seconds (returns HTTP 504 on execution timeout).
   - CPU-bound tasks (OpenCV / PIL / NumPy) MUST execute inside loop.run_in_executor(None, process_image, ...). Never run CPU-blocking code directly on the asyncio event loop.
   - Force garbage collection with gc.collect() inside the finally block of every worker invocation.
2. **Lazy Model Loading:**
   - Neural weights (U2-Net for background removal and LapSRN for upscaling) are loaded on demand and explicitly unloaded via _unload_session and _unload_lapsrn to release VRAM/RAM.
3. **Payload & Memory Constraints:**
   - Multipart payload maximum size is 5MB (1024 * 1024 * 5).
   - Rate limit on /v1/images/process is 5 requests per minute per IP/user.

---

## 6. Authentication & Cookie Flow

1. **Google OAuth2 Flow:** Handled by Fastify (/v1/auth/google and /v1/auth/google/callback).
2. **JWT Lifecycle:** Fastify issues a 7-day signed JWT upon Google validation.
3. **Cookie Storage:** The Next.js BFF (/api/auth/callback) writes the JWT into a secure cookie with HttpOnly, SameSite=Lax, and Secure (in production).
4. **Zero Client Storage:** JWT is never stored in localStorage or sessionStorage.
5. **API Whitelist:** Middleware verifies JWT on all endpoints except /health, /docs, and /v1/auth/google/*.

---

## 7. CLI Reference & Task Commands

The project uses Taskfile with pnpm and uv workspaces:

| Command | Action |
| :--- | :--- |
| `task dev` | Runs Worker (8000), API (8080), and Web (3000) concurrently |
| `task dev:api` | Runs Fastify API with tsx watch |
| `task dev:worker` | Runs FastAPI worker with uvicorn --reload |
| `task dev:web` | Runs Next.js frontend with hot reload |
| `task infra:up` | Boots PostgreSQL 17 container (docker compose up -d postgres) |
| `task infra:down` | Stops PostgreSQL container (docker compose down) |
| `task infra:logs` | Streams PostgreSQL logs (docker compose logs -f) |
| `task test` | Runs all test suites (Vitest on API and Pytest on Worker) |
| `task test:api` | Runs API unit tests via Vitest (pnpm --filter @kroma/api test) |
| `task test:worker` | Runs Worker unit tests via Pytest (uv run pytest) |
| `task lint` | Runs ESLint on Web and Ruff on Worker |
| `task db:generate` | Generates Drizzle migration files from schemas |
| `task db:migrate` | Applies pending database migrations |
| `task db:studio` | Launches Drizzle Studio database UI on port 4983 |
| `task build:shared`| Compiles @kroma/shared package |
| `task build:api` | Compiles API to dist/ |
| `task build:web` | Builds Next.js production bundle |
| `task build:all` | Compiles all packages and applications in dependency order |

### Adding Dependencies
- **Shared Package:** `pnpm --filter @kroma/shared add <pkg>`
- **API (Fastify):** `pnpm --filter @kroma/api add <pkg>`
- **Web (Next.js):** `pnpm --filter @kroma/web add <pkg>`
- **Worker (Python):** `cd apps/worker-image && uv add <pkg>`

---

## 8. Directory Structure & Key Responsibilities

### `packages/shared` (`@kroma/shared`)
- `src/types/user.ts`: UserDTO, User, GoogleUserInfo contracts.
- `src/types/image.ts`: ImageProcessOperations union, ImageProcessRequest, ImageProcessResponse, ResizeParams.
- `src/index.ts`: Barrel export consumed by apps/api and apps/web via workspace:*.

### `apps/api` (Fastify 5 + Drizzle ORM)
- `src/server.ts`: Plugin registrations (CORS, Cookie, JWT, Multipart, RateLimit, Swagger, Scalar) and graceful shutdown.
- `src/config/`: Environment configuration with Zod validation, database pool, JWT, and rate limit settings.
- `src/routes/`: Route declarations (/health, /v1/users, /v1/auth, /v1/images).
- `src/controllers/`: Request extraction and HTTP response handling.
- `src/usecases/`: Pure business logic decoupled from HTTP frameworks.
- `src/repositories/`: Repository interfaces and Drizzle SQL implementations.
- `src/database/schema/`: Typed table definitions (users.schema.ts).
- `src/database/migrations/`: Versioned SQL migration files generated by drizzle-kit.

### `apps/web` (Next.js 16 App Router)
- `src/app/(public)/login/`: Authentication screen with Google OAuth trigger.
- `src/app/(protected)/studio/`: Main studio workspace, dynamic [tool]/page.tsx route, and resize editor.
- `src/app/api/auth/callback/route.ts`: BFF handler receiving JWT and setting HttpOnly cookie.
- `src/app/api/images/process/route.ts`: BFF streaming proxy forwarding binary multipart to Fastify API.
- `src/resources/`: Client-side ObjectURL management and Server Actions.
- `src/lib/`: Static tool catalogs (tools.ts, resizes.ts, socials.ts).

### `apps/worker-image` (Python 3.11 + FastAPI)
- `app/main.py`: FastAPI entry point, semaphore limiter, timeouts, and forced garbage collection.
- `app/services/image_service.py`: Operation router mapping action strings to processor functions.
- `app/processor/`: Image processing implementations:
  - `effects.py`: Background removal (U2-Net), cartoon, pencil sketch, oil painting, blur, sepia, grayscale, vignette.
  - `upscale.py`: AI super-resolution (LapSRN x2 and x4).
  - `enhance.py`: Unsharp masking.
  - `color.py`: Saturation adjustment.
  - `resize.py`: Lanczos resizing.
  - `transform.py`: Horizontal and vertical flips.
- `scripts/download_models.py`: Downloads pre-trained LapSRN models to ~/.sr_models/.
- `tests/`: Automated test suite executed via pytest.

---

## 9. Engineering Workbooks (Adding Capabilities)

### Adding a New Image Effect
1. **Worker:** Implement effect function in `apps/worker-image/app/processor/effects.py`. Register operation in `app/services/image_service.py`. Add unit test in `tests/test_processors.py`.
2. **Shared:** Add operation string literal to `ImageProcessOperations` in `packages/shared/src/types/image.ts`. Run `task build:shared`.
3. **Web:** Add tool entry to `TOOLS` catalog in `apps/web/src/lib/tools.ts`. The dynamic route `/studio/[tool]` will handle UI state automatically.

### Adding a New API Endpoint
1. Create UseCase with unit tests in `apps/api/src/usecases/<domain>/`.
2. Define repository methods in `apps/api/src/repositories/interfaces/` and implement in Drizzle repository.
3. Create controller method in `apps/api/src/controllers/`.
4. Register route with Zod schema validation in `apps/api/src/routes/`.
5. Update DI factory in `apps/api/src/factories/`.

---

## 10. Operational Gotchas & Conventions

1. **uv Hardlink Error on Windows:**
   - If uv encounters cross-device hardlink failures, set `UV_LINK_MODE=copy`.
2. **Missing LapSRN Models:**
   - If AI upscale fails with FileNotFoundError, execute `uv run python scripts/download_models.py` inside `apps/worker-image`.
3. **Strict Binary Flow Integrity:**
   - Never convert image data to Base64 in any layer. Always use `Buffer` in Node.js, `bytes` in Python, and `Blob` / `URL.createObjectURL` in the browser.
4. **UI Design System Restrictions:**
   - Font: Strictly Outfit. Never use Inter.
   - Contrast tone: Deep Ink (#09090B). Never use pure black (#000000).
   - Visual elements: Use Lucide Icons. Never use emojis or emoticons.
5. **Git Commit Standards:**
   - Use Conventional Commits: `feat(scope): description`, `fix(scope): description`, `chore: description`.
   - Lowercase type, scope, and description. Do not add a trailing period.
