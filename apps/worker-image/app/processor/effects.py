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
