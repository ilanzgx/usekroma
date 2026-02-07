"""
Operações de efeitos visuais.
Inclui: blur, remove_background
"""
import gc
import time
import logging
from PIL import Image, ImageFilter
from rembg import remove, new_session

# Configuração do logger
logger = logging.getLogger(__name__)

_session = None

def _get_session():
    global _session
    if _session is None:
        logger.info("[U2-NET] ================================================")
        logger.info("[U2-NET] |  LOADING MODEL...                            |")
        logger.info("[U2-NET] ================================================")

        start_time = time.time()
        _session = new_session("u2net")
        elapsed = time.time() - start_time

        logger.info("[U2-NET] ================================================")
        logger.info("[U2-NET] |  [OK] Model loaded successfully!             |")
        logger.info(f"[U2-NET] |  [TIME] Load time: {elapsed:.2f}s                     |")
        logger.info("[U2-NET] |  [RAM] Estimated: ~170MB                     |")
        logger.info("[U2-NET] ================================================")
    return _session

def _unload_session():
    """Descarrega o modelo da memória para economizar recursos."""
    global _session
    if _session is not None:
        logger.info("[U2-NET] ================================================")
        logger.info("[U2-NET] |  UNLOADING MODEL...                          |")
        logger.info("[U2-NET] ================================================")

        _session = None
        gc.collect()

        logger.info("[U2-NET] ================================================")
        logger.info("[U2-NET] |  [OK] Model unloaded successfully!           |")
        logger.info("[U2-NET] |  [GC] Memory freed via gc.collect()          |")
        logger.info("[U2-NET] |  [$$$] Ready for scale-to-zero               |")
        logger.info("[U2-NET] ================================================")

def remove_background(image: Image.Image, unload_after: bool = True) -> Image.Image:
    """
    Remove o fundo de uma imagem usando IA (modelo U2-Net).

    Args:
        image: Imagem de entrada
        unload_after: Se True, descarrega o modelo após uso para economizar memória

    Retorna uma imagem RGBA com fundo transparente.
    """
    # converte para RGBA se necessário para suportar transparência
    if image.mode != "RGBA":
        image = image.convert("RGBA")

    result = remove(image, session=_get_session())

    if unload_after:
        _unload_session()

    return result

def apply_blur(image: Image.Image, radius: float = 8) -> Image.Image:
    """
    Aplica desfoque gaussiano na imagem.

    Args:
        image: Imagem de entrada
        radius: Intensidade do desfoque (padrão: 8)
    """
    return image.filter(ImageFilter.GaussianBlur(radius=radius))


def apply_grayscale(image: Image.Image) -> Image.Image:
    """
    Converte a imagem para escala de cinza (preto e branco).

    Args:
        image: Imagem de entrada

    Returns:
        Imagem em escala de cinza (modo RGB para compatibilidade)
    """
    return image.convert("L").convert("RGB")


def apply_sepia(image: Image.Image) -> Image.Image:
    """
    Aplica efeito sépia vintage na imagem.

    Args:
        image: Imagem de entrada

    Returns:
        Imagem com tom sépia
    """
    # Converte para RGB se necessário
    if image.mode != "RGB":
        image = image.convert("RGB")

    width, height = image.size
    pixels = image.load()

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]

            # Fórmula clássica de sépia
            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
            tb = int(0.272 * r + 0.534 * g + 0.131 * b)

            # Limita valores a 255
            pixels[x, y] = (min(255, tr), min(255, tg), min(255, tb))

    return image


def apply_vignette(image: Image.Image, intensity: float = 0.5) -> Image.Image:
    """
    Aplica efeito de vinheta (bordas escuras) na imagem.

    Args:
        image: Imagem de entrada
        intensity: Intensidade do efeito (0.0 a 1.0, padrão: 0.5)

    Returns:
        Imagem com efeito de vinheta
    """
    import math

    # Converte para RGB se necessário
    if image.mode != "RGB":
        image = image.convert("RGB")

    width, height = image.size
    pixels = image.load()

    # Centro da imagem
    cx, cy = width // 2, height // 2

    # Raio máximo (diagonal)
    max_radius = math.sqrt(cx ** 2 + cy ** 2)

    for y in range(height):
        for x in range(width):
            # Distância do pixel ao centro
            dx = x - cx
            dy = y - cy
            distance = math.sqrt(dx ** 2 + dy ** 2)

            # Fator de escurecimento baseado na distância
            factor = 1 - (intensity * (distance / max_radius) ** 2)
            factor = max(0, min(1, factor))

            r, g, b = pixels[x, y]
            pixels[x, y] = (
                int(r * factor),
                int(g * factor),
                int(b * factor)
            )

    return image

