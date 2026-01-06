"""
Operações de transformação de imagem.
Inclui: upscale, resize, crop, rotate, flip
"""
from PIL import Image, ImageFilter

def apply_upscale(image: Image.Image, scale: int = 2) -> Image.Image:
    """
    Aumenta a resolução da imagem.

    Args:
        image: Imagem de entrada
        scale: Fator de escala (padrão: 2x)
    """
    w, h = image.size
    image = image.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    image = image.filter(ImageFilter.SHARPEN)
    return image
