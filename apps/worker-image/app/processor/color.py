"""
Operações de ajuste de cores.
Inclui: saturate
"""
from PIL import Image, ImageEnhance


def apply_saturate(image: Image.Image, factor: float = 1.5) -> Image.Image:
    """
    Ajusta a saturação de cores da imagem.

    Args:
        image: Imagem de entrada
        factor: Fator de saturação (1.0 = original, >1 = mais saturado, <1 = menos saturado)
                Padrão: 1.5 (50% mais saturado)

    Returns:
        Imagem com saturação ajustada
    """
    # Converte para RGB se necessário
    if image.mode != "RGB":
        image = image.convert("RGB")

    enhancer = ImageEnhance.Color(image)
    return enhancer.enhance(factor)
