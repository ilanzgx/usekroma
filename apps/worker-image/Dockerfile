# ---------- builder ----------
FROM python:3.13-slim AS builder

WORKDIR /app

# Dependências nativas, se necessário
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
 && rm -rf /var/lib/apt/lists/*

# Criar venv isolado
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Instalar uv e dependências
COPY pyproject.toml ./
RUN pip install --no-cache-dir uv \
 && uv pip install --no-cache .

# ---------- runner ----------
FROM python:3.13-slim AS runner

WORKDIR /app
RUN useradd -m appuser

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY --chown=appuser:appuser src ./src

USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]