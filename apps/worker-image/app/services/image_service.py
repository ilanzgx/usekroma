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
    apply_oil_painting,
    apply_resize,
)
from PIL import Image

def process_image(image: Image.Image, operation: str, params: dict | None = None) -> Image.Image:
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
        "oil_painting": apply_oil_painting,
    }

    # Operações que precisam de parâmetros extras
    if operation == "resize":
        if not params or "width" not in params or "height" not in params:
            raise ValueError("Operação 'resize' requer parâmetros 'width' e 'height'.")
        return apply_resize(image, int(params["width"]), int(params["height"]))

    if operation not in operations:
        raise ValueError(f"Operação inválida: {operation}. Disponíveis: {list(operations.keys())}")

    return operations[operation](image)

