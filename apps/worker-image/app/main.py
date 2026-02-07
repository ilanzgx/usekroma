import asyncio
import logging
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import Response, JSONResponse
from app.utils.image_loader import load_image_from_bytes
from app.services.image_service import process_image

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(message)s",
    datefmt="%H:%M:%S"
)

logger = logging.getLogger(__name__)

app = FastAPI()

# Worker limitado a processar apenas uma imagem por vez.
processing_lock = asyncio.Semaphore(1)

SEMAPHORE_TIMEOUT = 30 # 30 segundos
PROCESSING_TIMEOUT = 120 # 2 minutos

@app.get("/health")
async def health_check():
    """Endpoint de health check para Azure Container Apps."""
    return JSONResponse(
        content={"status": "healthy", "service": "worker-image"},
        status_code=200
    )


@app.post("/process")
async def process_endpoint(file: UploadFile = File(...), operation: str = Form(...)):
    # Tenta adquirir o semáforo com timeout
    try:
        await asyncio.wait_for(
            processing_lock.acquire(),
            timeout=SEMAPHORE_TIMEOUT
        )
    except asyncio.TimeoutError:
        logger.warning(f"[TIMEOUT] Semáforo ocupado por mais de {SEMAPHORE_TIMEOUT}s")
        raise HTTPException(
            status_code=503,
            detail="Servidor ocupado. Tente novamente em alguns segundos."
        )

    try:
        # Processa a imagem com timeout
        data = await file.read()
        image = load_image_from_bytes(data)

        # Executa o processamento em thread separada com timeout
        loop = asyncio.get_event_loop()
        result_image = await asyncio.wait_for(
            loop.run_in_executor(None, process_image, image, operation),
            timeout=PROCESSING_TIMEOUT
        )

        buffer = BytesIO()
        result_image.save(buffer, format="PNG")

        return Response(content=buffer.getvalue(), media_type="image/png")

    except asyncio.TimeoutError:
        logger.error(f"[TIMEOUT] Processamento excedeu {PROCESSING_TIMEOUT}s")
        raise HTTPException(
            status_code=504,
            detail="Tempo de processamento excedido. Tente com uma imagem menor."
        )
    except Exception as e:
        logger.error(f"[ERROR] Erro no processamento: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        processing_lock.release()
        import gc
        gc.collect()