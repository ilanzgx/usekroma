import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.consumer import start_consumer

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s | %(message)s", datefmt="%H:%M:%S"
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicia o consumidor RabbitMQ em background no startup
    consumer_task = asyncio.create_task(start_consumer())
    yield
    # Cancela a task no shutdown
    consumer_task.cancel()
    try:
        await consumer_task
    except asyncio.CancelledError:
        pass


app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy", "service": "worker-image"}, status_code=200
    )
