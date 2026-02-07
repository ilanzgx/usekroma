# ---------- builder ----------
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
 && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY pyproject.toml ./

RUN pip install --no-cache-dir uv \
 && uv pip install --no-cache . \
 && find /opt/venv -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true \
 && find /opt/venv -type f -name "*.pyc" -delete 2>/dev/null || true \
 && find /opt/venv -type f -name "*.pyo" -delete 2>/dev/null || true \
 && find /opt/venv -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true \
 && find /opt/venv -type d -name "test" -exec rm -rf {} + 2>/dev/null || true \
 && find /opt/venv -type f -name "*.md" -delete 2>/dev/null || true \
 && find /opt/venv -type f -name "*.rst" -delete 2>/dev/null || true \
 && find /opt/venv -type f -name "*.txt" ! -name "requirements*.txt" -delete 2>/dev/null || true \
 && rm -rf /opt/venv/lib/python*/site-packages/pip* \
 && rm -rf /opt/venv/lib/python*/site-packages/setuptools* \
 && rm -rf /opt/venv/lib/python*/site-packages/wheel*

RUN python -c "from rembg import new_session; new_session('u2net')"

RUN mkdir -p /root/.sr_models \
 && curl -sSL -o /root/.sr_models/LapSRN_x2.pb https://github.com/fannymonori/TF-LapSRN/raw/master/export/LapSRN_x2.pb \
 && curl -sSL -o /root/.sr_models/LapSRN_x4.pb https://github.com/fannymonori/TF-LapSRN/raw/master/export/LapSRN_x4.pb

# ---------- runner ----------
FROM python:3.11-slim AS runner

WORKDIR /app

# Cria usuário não-root
RUN useradd -m appuser \
 && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Variáveis de ambiente para otimização
ENV PATH="/opt/venv/bin:$PATH" \
    HOME="/home/appuser" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ONNX_NUM_THREADS=1 \
    OMP_NUM_THREADS=1 \
    NUMBA_CACHE_DIR=/tmp/numba_cache \
    MODELS_DIR=/home/appuser/.sr_models

COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /root/.u2net /home/appuser/.u2net
COPY --from=builder /root/.sr_models /home/appuser/.sr_models

RUN chown -R appuser:appuser /home/appuser

COPY --chown=appuser:appuser app ./app

USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

