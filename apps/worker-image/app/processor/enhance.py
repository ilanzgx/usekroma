"""
Operações de melhoria de qualidade de imagem.
Inclui: sharpen, denoise, contrast, brightness
"""
from PIL import Image, ImageFilter

def apply_sharpen(image: Image.Image) -> Image.Image:
    """
    Aplica nitidez à imagem usando UnsharpMask.

    Parâmetros do UnsharpMask:
    - radius: Extensão espacial do borrão (tamanho das bordas afetadas)
    - percent: Intensidade do efeito de nitidez
    - threshold: Mínimo de diferença de brilho para aplicar (evita ruído)
    """
    return image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=150, threshold=25))
