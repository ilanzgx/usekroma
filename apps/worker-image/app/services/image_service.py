from app.processor import apply_sharpen, apply_blur, apply_upscale
from PIL import Image

def process_image(image: Image.Image, operation: str) -> Image.Image:
    """Processa a imagem com a operação especificada."""

    operations = {
        "sharpen": apply_sharpen,
        "blur": apply_blur,
        "upscale": apply_upscale,
    }

    if operation not in operations:
        raise ValueError(f"Operação inválida: {operation}. Disponíveis: {list(operations.keys())}")

    return operations[operation](image)