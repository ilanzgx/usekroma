from app.processor import (
    apply_sharpen,
    apply_blur,
    apply_upscale,
    remove_background,
    apply_ai_upscale,
    apply_grayscale,
    apply_sepia,
    apply_vignette,
    apply_flip_horizontal,
    apply_flip_vertical,
    apply_saturate,
    apply_cartoon,
    apply_pencil_sketch,
)
from PIL import Image

def process_image(image: Image.Image, operation: str) -> Image.Image:
    """Processa a imagem com a operação especificada."""

    operations = {
        "sharpen": apply_sharpen,
        "blur": apply_blur,
        "upscale": apply_upscale,
        "remove_background": remove_background,
        "ai_upscale": apply_ai_upscale,
        "grayscale": apply_grayscale,
        "sepia": apply_sepia,
        "vignette": apply_vignette,
        "flip_horizontal": apply_flip_horizontal,
        "flip_vertical": apply_flip_vertical,
        "saturate": apply_saturate,
        "cartoon": apply_cartoon,
        "pencil_sketch": apply_pencil_sketch,
    }

    if operation not in operations:
        raise ValueError(f"Operação inválida: {operation}. Disponíveis: {list(operations.keys())}")

    return operations[operation](image)

