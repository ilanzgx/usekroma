"""
Módulo de redimensionamento de imagens.

Estica a imagem para preencher completamente o novo aspect ratio.
"""

from PIL import Image


def apply_resize(image: Image.Image, width: int, height: int) -> Image.Image:
    """
    Redimensiona a imagem para as dimensões especificadas (stretch).

    A imagem inteira é preservada e esticada para preencher
    completamente o canvas alvo. As proporções são ajustadas
    para o novo aspect ratio.

    Args:
        image: Imagem de entrada
        width: Largura alvo
        height: Altura alvo

    Returns:
        Imagem redimensionada para as dimensões exatas
    """
    if image.mode == "RGBA":
        return image.resize((width, height), Image.LANCZOS)

    return image.resize((width, height), Image.LANCZOS)
