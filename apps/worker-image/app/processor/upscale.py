"""
Operações de super-resolução usando IA.
Inclui: LapSRN (Laplacian Pyramid Super-Resolution Network)
"""
import gc
import os
import time
import logging
from pathlib import Path
from PIL import Image
import numpy as np
import cv2

logger = logging.getLogger(__name__)

# Diretório onde os modelos ficam armazenados
MODELS_DIR = Path(os.environ.get("MODELS_DIR", Path.home() / ".sr_models"))

# Configuração dos modelos disponíveis
LAPSRN_MODELS = {
    2: "LapSRN_x2.pb",
    4: "LapSRN_x4.pb",
}

# Cache do super resolution
_sr_instance = None
_current_scale = None


def _get_model_path(scale: int) -> Path:
    """Retorna o caminho do modelo para o fator de escala especificado."""
    if scale not in LAPSRN_MODELS:
        raise ValueError(f"Escala inválida: {scale}. Disponíveis: {list(LAPSRN_MODELS.keys())}")
    return MODELS_DIR / LAPSRN_MODELS[scale]


def _load_lapsrn(scale: int):
    """Carrega o modelo LapSRN para o fator de escala especificado."""
    global _sr_instance, _current_scale

    # Se já está carregado com a mesma escala, reutiliza
    if _sr_instance is not None and _current_scale == scale:
        return _sr_instance

    # Descarrega modelo anterior se existir
    if _sr_instance is not None:
        _unload_lapsrn()

    model_path = _get_model_path(scale)

    if not model_path.exists():
        raise FileNotFoundError(
            f"Modelo não encontrado: {model_path}. "
            f"Baixe os modelos LapSRN e coloque em {MODELS_DIR}"
        )

    logger.info("[LapSRN] ================================================")
    logger.info(f"[LapSRN] |  LOADING MODEL (x{scale})...                      |")
    logger.info("[LapSRN] ================================================")

    start_time = time.time()

    _sr_instance = cv2.dnn_superres.DnnSuperResImpl_create()
    _sr_instance.readModel(str(model_path))
    _sr_instance.setModel("lapsrn", scale)
    _current_scale = scale

    elapsed = time.time() - start_time

    logger.info("[LapSRN] ================================================")
    logger.info("[LapSRN] |  [OK] Model loaded successfully!             |")
    logger.info(f"[LapSRN] |  [TIME] Load time: {elapsed:.2f}s                     |")
    logger.info(f"[LapSRN] |  [SCALE] {scale}x upscaling ready                  |")
    logger.info("[LapSRN] ================================================")

    return _sr_instance


def _unload_lapsrn():
    """Descarrega o modelo da memória para economizar recursos."""
    global _sr_instance, _current_scale

    if _sr_instance is not None:
        logger.info("[LapSRN] ================================================")
        logger.info("[LapSRN] |  UNLOADING MODEL...                          |")
        logger.info("[LapSRN] ================================================")

        _sr_instance = None
        _current_scale = None
        gc.collect()

        logger.info("[LapSRN] ================================================")
        logger.info("[LapSRN] |  [OK] Model unloaded successfully!           |")
        logger.info("[LapSRN] |  [GC] Memory freed via gc.collect()          |")
        logger.info("[LapSRN] |  [$$$] Ready for scale-to-zero               |")
        logger.info("[LapSRN] ================================================")


def apply_ai_upscale(image: Image.Image, scale: int = 2, unload_after: bool = True) -> Image.Image:
    """
    Aumenta a resolução da imagem usando IA (modelo LapSRN).

    Args:
        image: Imagem de entrada (PIL Image)
        scale: Fator de escala (2 ou 4)
        unload_after: Se True, descarrega o modelo após uso para economizar memória

    Returns:
        Imagem com resolução aumentada
    """
    if scale not in LAPSRN_MODELS:
        raise ValueError(f"Escala inválida: {scale}. Use 2 ou 4.")

    # Limite máximo de pixels na entrada para evitar timeout
    MAX_INPUT_SIZE = 1024

    try:
        # Redimensiona imagem se for muito grande
        width, height = image.size
        if max(width, height) > MAX_INPUT_SIZE:
            ratio = MAX_INPUT_SIZE / max(width, height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            logger.info(f"[LapSRN] Redimensionando entrada: {width}x{height} -> {new_width}x{new_height}")
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Converte PIL para OpenCV (BGR)
        img_rgb = image.convert("RGB")
        img_array = np.array(img_rgb)
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        # Carrega o modelo e aplica upscale
        sr = _load_lapsrn(scale)
        result_bgr = sr.upsample(img_bgr)

        # Converte de volta para PIL (RGB)
        result_rgb = cv2.cvtColor(result_bgr, cv2.COLOR_BGR2RGB)
        result_image = Image.fromarray(result_rgb)

        return result_image

    except Exception as e:
        logger.error(f"[LapSRN] Erro durante upscale: {e}")
        raise

    finally:
        if unload_after:
            _unload_lapsrn()


def get_available_scales() -> list[int]:
    """Retorna os fatores de escala disponíveis."""
    return list(LAPSRN_MODELS.keys())
