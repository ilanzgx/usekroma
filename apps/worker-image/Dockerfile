# ---------- builder ----------
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
 && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY pyproject.toml ./

RUN pip install --no-cache-dir uv \
 && uv pip install --no-cache .

RUN python -c "from rembg import new_session; new_session('u2net')"

# ---------- runner ----------
FROM python:3.11-slim AS runner

WORKDIR /app

RUN useradd -m appuser

ENV PATH="/opt/venv/bin:$PATH"
ENV HOME="/home/appuser"
ENV ONNX_NUM_THREADS=1
ENV OMP_NUM_THREADS=1

COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /root/.u2net /home/appuser/.u2net

RUN chown -R appuser:appuser /home/appuser

COPY --chown=appuser:appuser app ./app

USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
