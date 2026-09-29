from io import BytesIO
from unittest.mock import patch
from PIL import Image
import pytest
from app.services.image_service import process_image
from app.consumer import process_job


def create_sample_image(width=100, height=100, mode="RGB", color=(255, 0, 0)) -> Image.Image:
    """Cria uma imagem de teste em memória."""
    return Image.new(mode, (width, height), color=color)


def image_to_bytes(image: Image.Image) -> bytes:
    """Converte uma imagem PIL para bytes PNG."""
    buf = BytesIO()
    image.save(buf, format="PNG")
    return buf.getvalue()


def test_process_image_transformations():
    """Testa transformações diretas no serviço de imagem."""
    img = create_sample_image(120, 80)

    # Teste de resize
    resized = process_image(img, "resize", {"width": 60, "height": 40})
    assert resized.size == (60, 40)

    # Teste de grayscale
    gray = process_image(img, "grayscale")
    assert gray.size == (120, 80)

    # Teste de flip horizontal
    flipped = process_image(img, "flip_horizontal")
    assert flipped.size == (120, 80)

    # Teste de sharpen
    sharp = process_image(img, "sharpen")
    assert sharp.size == (120, 80)


@pytest.mark.anyio
async def test_process_job():
    """Testa a execução assíncrona do job pelo consumidor."""
    img = create_sample_image(50, 50)
    img_bytes = image_to_bytes(img)

    with patch("app.consumer.download_bytes", return_value=img_bytes), patch(
        "app.consumer.upload_bytes"
    ) as mock_upload:
        result = await process_job(
            {
                "jobId": "test-job-uuid",
                "imageKey": "uploads/test.png",
                "operation": "grayscale",
            }
        )

        assert result["status"] == "done"
        assert result["jobId"] == "test-job-uuid"
        assert result["resultKey"] == "results/test-job-uuid.png"
        assert mock_upload.called
