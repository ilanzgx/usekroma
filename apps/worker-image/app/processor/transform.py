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


def apply_flip_horizontal(image: Image.Image) -> Image.Image:
    """
    Espelha a imagem horizontalmente (flip left-right).

    Args:
        image: Imagem de entrada

    Returns:
        Imagem espelhada horizontalmente
    """
    return image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)


def apply_flip_vertical(image: Image.Image) -> Image.Image:
    """
    Inverte a imagem verticalmente (flip top-bottom).

    Args:
        image: Imagem de entrada

    Returns:
        Imagem invertida verticalmente
    """
    return image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

