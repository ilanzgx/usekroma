"""
Operações de efeitos visuais.
Inclui: blur, remove_background
"""
from PIL import Image, ImageFilter
from rembg import remove
from app.processor.session import session

def remove_background(image: Image.Image) -> Image.Image:
    """
    Remove o fundo de uma imagem usando IA (modelo U2-Net).

    Retorna uma imagem RGBA com fundo transparente.
    """
    # converte para RGBA se necessário para suportar transparência
    if image.mode != "RGBA":
        image = image.convert("RGBA")

    return remove(image, session=session)

def apply_blur(image: Image.Image, radius: float = 8) -> Image.Image:
    """
    Aplica desfoque gaussiano na imagem.

    Args:
        image: Imagem de entrada
        radius: Intensidade do desfoque (padrão: 8)
    """
    return image.filter(ImageFilter.GaussianBlur(radius=radius))
