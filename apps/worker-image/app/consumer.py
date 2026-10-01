import asyncio
import gc
import json
import logging
import os
from io import BytesIO

# Configuração de threads do ONNX e OpenMP para evitar deadlocks com o asyncio threadpool
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("ONNX_NUM_THREADS", "1")

import aio_pika
from pathlib import Path
from dotenv import load_dotenv

from app.services.image_service import process_image
from app.utils.image_loader import load_image_from_bytes
from app.utils.storage import download_bytes, upload_bytes

# Carrega .env local do worker e da raiz do monorepo se existirem
_worker_dir = Path(__file__).resolve().parent.parent
load_dotenv(_worker_dir / ".env")
load_dotenv(_worker_dir.parent.parent / ".env")
load_dotenv()

logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://kroma:kroma@localhost:5672")
PROCESSING_TIMEOUT = 120  # segundos (conforme diretriz arquitetural AGENTS.md)


def _execute_processing(
    image_bytes: bytes, operation: str, params: dict | None
) -> bytes:
    """Função síncrona/CPU-bound executada fora da thread principal do asyncio."""
    image = load_image_from_bytes(image_bytes)
    processed_image = process_image(image, operation, params)

    output_buffer = BytesIO()
    processed_image.save(output_buffer, format="PNG")
    return output_buffer.getvalue()


async def process_job(payload: dict) -> dict:
    job_id = payload["jobId"]
    image_key = payload["imageKey"]
    operation = payload["operation"]
    params = payload.get("params")

    logger.info(f"[Worker] Iniciando job {job_id} ({operation})")

    # 1. Baixa imagem original do MinIO em thread pool (I/O)
    logger.info(f"[Worker] Baixando imagem original {image_key}...")
    image_bytes = await asyncio.to_thread(download_bytes, image_key)
    logger.info(
        f"[Worker] Imagem {image_key} baixada com sucesso ({len(image_bytes)} bytes)"
    )

    # 2. Processa a imagem em thread pool (CPU-bound) com timeout de 120s
    logger.info(f"[Worker] Executando processamento ({operation})...")
    loop = asyncio.get_running_loop()
    output_bytes = await asyncio.wait_for(
        loop.run_in_executor(
            None,
            _execute_processing,
            image_bytes,
            operation,
            params,
        ),
        timeout=PROCESSING_TIMEOUT,
    )
    logger.info(
        f"[Worker] Processamento concluído com sucesso ({len(output_bytes)} bytes)"
    )

    # 3. Salva o resultado no MinIO em results/{jobId}.png
    result_key = f"results/{job_id}.png"
    await asyncio.to_thread(upload_bytes, result_key, output_bytes, "image/png")

    logger.info(f"[Worker] Job {job_id} finalizado e resultado salvo em {result_key}")
    return {
        "jobId": job_id,
        "status": "done",
        "resultKey": result_key,
    }


is_ready = False


def is_consumer_ready() -> bool:
    return is_ready


async def start_consumer():
    global is_ready
    while True:
        connection = None
        try:
            logger.info(f"[Worker] Conectando ao RabbitMQ em {RABBITMQ_URL}...")
            connection = await aio_pika.connect_robust(RABBITMQ_URL)
            channel = await connection.channel()
            await channel.set_qos(prefetch_count=1)

            queue_processing = await channel.declare_queue("image-processing", durable=True)
            await channel.declare_queue("image-results", durable=True)

            is_ready = True
            logger.info("[Worker] Consumidor RabbitMQ pronto e escutando 'image-processing'")

            async with queue_processing.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process():
                        payload = json.loads(message.body.decode())
                        job_id = payload.get("jobId")

                        try:
                            result_payload = await process_job(payload)
                        except asyncio.TimeoutError:
                            err_msg = f"Tempo limite de processamento excedido ({PROCESSING_TIMEOUT}s)"
                            logger.error(
                                f"[Worker] Timeout no processamento do job {job_id}: {err_msg}"
                            )
                            result_payload = {
                                "jobId": job_id,
                                "status": "failed",
                                "errorMessage": err_msg,
                            }
                        except Exception as exc:
                            logger.exception(
                                f"[Worker] Falha no processamento do job {job_id}: {exc}"
                            )
                            result_payload = {
                                "jobId": job_id,
                                "status": "failed",
                                "errorMessage": str(exc),
                            }
                        finally:
                            gc.collect()

                        await channel.default_exchange.publish(
                            aio_pika.Message(
                                body=json.dumps(result_payload).encode(),
                                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                            ),
                            routing_key="image-results",
                        )
        except asyncio.CancelledError:
            is_ready = False
            logger.info("[Worker] Consumidor RabbitMQ cancelado.")
            if connection and not connection.is_closed:
                await connection.close()
            break
        except Exception as exc:
            is_ready = False
            logger.error(
                f"[Worker] Erro no consumidor RabbitMQ: {exc}. Reconectando em 3s..."
            )
            if connection and not connection.is_closed:
                try:
                    await connection.close()
                except Exception:
                    pass
            await asyncio.sleep(3)
