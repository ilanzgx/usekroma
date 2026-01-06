"""
Operações de efeitos visuais.
Inclui: blur, grayscale, sepia, emboss, contour
"""
from PIL import Image, ImageFilter

def apply_blur(image: Image.Image, radius: float = 8) -> Image.Image:
    """
    Aplica desfoque gaussiano na imagem.

    Args:
        image: Imagem de entrada
        radius: Intensidade do desfoque (padrão: 8)
    """
    return image.filter(ImageFilter.GaussianBlur(radius=radius))
