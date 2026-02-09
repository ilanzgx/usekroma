"""
Operações de efeitos visuais.
Inclui: blur, remove_background, cartoon, grayscale, sepia, vignette
"""
import gc
import time
import logging
import cv2
import numpy as np
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
    try:
        # converte para RGBA se necessário para suportar transparência
        if image.mode != "RGBA":
            image = image.convert("RGBA")

        result = remove(image, session=_get_session())
        return result

    except Exception as e:
        logger.error(f"[U2-NET] Erro durante remoção de fundo: {e}")
        raise

    finally:
        if unload_after:
            _unload_session()

def apply_blur(image: Image.Image, radius: float = 8) -> Image.Image:
    """
    Aplica desfoque gaussiano na imagem.

    Args:
        image: Imagem de entrada
        radius: Intensidade do desfoque (padrão: 8)
    """
    return image.filter(ImageFilter.GaussianBlur(radius=radius))

def apply_cartoon(image: Image.Image) -> Image.Image:
    """
    Aplica efeito cartoon/desenho animado na imagem.

    Técnica avançada que combina:
    1. Bilateral filter para suavizar cores mantendo bordas
    2. Quantização de cores para reduzir paleta (K-Means otimizado)
    3. Boost de saturação para cores vibrantes
    4. Edge detection para contornos pretos
    5. Combinação das camadas

    Args:
        image: Imagem de entrada

    Returns:
        Imagem com efeito cartoon realista
    """
    from scipy.spatial import cKDTree

    # Converte PIL para OpenCV (BGR)
    if image.mode == "RGBA":
        image = image.convert("RGB")

    img_array = np.array(image)
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    # 1. Reduz ruído e suaviza mantendo bordas (bilateral filter)
    # Aplicamos múltiplas vezes para efeito mais forte
    color = img_bgr
    for _ in range(1):
        color = cv2.bilateralFilter(color, d=9, sigmaColor=50, sigmaSpace=50)

    # 2. Quantização de cores OTIMIZADA
    # K-Means em miniatura + KDTree para mapeamento rápido
    h, w = color.shape[:2]

    # Redimensiona para miniatura (K-Means fica muito mais rápido)
    max_dim = 450
    scale = max_dim / max(h, w) if max(h, w) > max_dim else 1.0
    if scale < 1.0:
        small = cv2.resize(color, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    else:
        small = color

    # K-Means na miniatura com mesmos parâmetros de qualidade
    data_small = np.float32(small).reshape((-1, 3))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)
    k = 14  # Mais cores para transições mais suaves
    _, _, centers = cv2.kmeans(data_small, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centers = np.uint8(centers)

    # Usa KDTree para mapear cores na imagem original (muito rápido)
    tree = cKDTree(centers)
    data_full = color.reshape((-1, 3))
    _, labels = tree.query(data_full)
    quantized = centers[labels].reshape(color.shape)

    # 3. Boost de saturação para cores mais vibrantes
    hsv = cv2.cvtColor(quantized, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.4, 0, 255)  # +40% saturação
    quantized = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    # 4. Edge detection (contornos)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 11)
    edges = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY,
        blockSize=5,
        C=2
    )

    # 5. Combina cores quantizadas com bordas
    edges_colored = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    cartoon_bgr = cv2.bitwise_and(quantized, edges_colored)

    # Converte de volta para RGB
    cartoon_rgb = cv2.cvtColor(cartoon_bgr, cv2.COLOR_BGR2RGB)

    return Image.fromarray(cartoon_rgb)


def apply_pencil_sketch(image: Image.Image) -> Image.Image:
    """
    Aplica efeito de desenho a lápis na imagem.

    Técnica avançada que simula desenho feito à mão:
    1. Color dodge blend para base do sketch
    2. Múltiplas camadas de hachura em ângulos diferentes
    3. Textura de papel para realismo
    4. Variações sutis simulando traços humanos

    Args:
        image: Imagem de entrada

    Returns:
        Imagem com efeito de desenho a lápis realista
    """
    # Converte PIL para OpenCV (BGR)
    if image.mode == "RGBA":
        image = image.convert("RGB")

    img_array = np.array(image)
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    h, w = img_bgr.shape[:2]

    # 1. Converte para escala de cinza
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # 2. Color Dodge Blend para base do sketch
    inverted = cv2.bitwise_not(gray)
    blurred = cv2.GaussianBlur(inverted, (21, 21), sigmaX=0, sigmaY=0)
    blurred_inv = cv2.bitwise_not(blurred)
    sketch = cv2.divide(gray, blurred_inv, scale=256.0)

    # 3. Melhora o contraste
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    sketch = clahe.apply(sketch)

    # 4. Cria múltiplas camadas de RABISCOS FINOS e delicados
    # Pequenos traços em várias direções, como um artista fazendo hachuras suaves

    def create_fine_strokes(h, w, angle_degrees, stroke_length=3):
        """Cria camada de rabiscos finos e curtos em um ângulo"""
        # Ruído base mais fino
        noise = np.random.rand(h, w).astype(np.float32)

        # Kernel de traço curto e fino
        kernel = np.zeros((stroke_length, stroke_length), dtype=np.float32)
        angle_rad = np.radians(angle_degrees)
        center = stroke_length // 2

        for i in range(stroke_length):
            offset = i - center
            x = int(center + offset * np.cos(angle_rad) + 0.5)
            y = int(center + offset * np.sin(angle_rad) + 0.5)
            x = max(0, min(stroke_length - 1, x))
            y = max(0, min(stroke_length - 1, y))
            kernel[y, x] = 1

        kernel = kernel / max(kernel.sum(), 1)
        strokes = cv2.filter2D(noise, -1, kernel)
        return strokes

    # Cria 5 camadas de rabiscos finos em diferentes ângulos
    # Kernels pequenos (3-5px) para traços delicados
    strokes1 = create_fine_strokes(h, w, 30, 3)    # Leve diagonal
    strokes2 = create_fine_strokes(h, w, 60, 4)    # Diagonal média
    strokes3 = create_fine_strokes(h, w, 120, 3)   # Diagonal oposta
    strokes4 = create_fine_strokes(h, w, 150, 4)   # Quase horizontal
    strokes5 = create_fine_strokes(h, w, 80, 5)    # Quase vertical

    # Combina os rabiscos com pesos variados para naturalidade
    combined_strokes = (
        strokes1 * 0.22 +
        strokes2 * 0.20 +
        strokes3 * 0.22 +
        strokes4 * 0.18 +
        strokes5 * 0.18
    )

    # Normaliza para variação muito sutil (95-100%)
    combined_strokes = cv2.normalize(combined_strokes, None, 0.93, 1.0, cv2.NORM_MINMAX)

    # 5. Adiciona micro-textura de grafite (ruído bem fino)
    graphite = np.random.rand(h, w).astype(np.float32)
    graphite = cv2.GaussianBlur(graphite, (3, 3), 0)
    graphite = cv2.normalize(graphite, None, 0.96, 1.0, cv2.NORM_MINMAX)

    # 6. Textura de papel sutil
    paper = np.random.rand(h, w).astype(np.float32)
    paper = cv2.GaussianBlur(paper, (7, 7), 0)
    paper = cv2.normalize(paper, None, 0.95, 1.0, cv2.NORM_MINMAX)

    # 7. Variação nas áreas escuras (pressão do lápis)
    sketch_float = sketch.astype(np.float32)
    dark_mask = (sketch_float < 128).astype(np.float32)
    sketch_blurred = cv2.GaussianBlur(sketch_float, (3, 3), 0)
    sketch_float = sketch_float * (1 - dark_mask * 0.2) + sketch_blurred * (dark_mask * 0.2)

    # 8. Combina tudo de forma sutil
    sketch_normalized = sketch_float / 255.0
    sketch_textured = sketch_normalized * combined_strokes * graphite * paper

    # Ajusta contraste final
    sketch_final = np.clip(sketch_textured * 255, 0, 255).astype(np.uint8)

    # Sharpening muito suave para manter delicadeza
    kernel_sharp = np.array([[0, -0.3, 0],
                             [-0.3, 2.2, -0.3],
                             [0, -0.3, 0]])
    sketch_final = cv2.filter2D(sketch_final, -1, kernel_sharp)
    sketch_final = np.clip(sketch_final, 0, 255).astype(np.uint8)

    # Converte para RGB
    sketch_rgb = cv2.cvtColor(sketch_final, cv2.COLOR_GRAY2RGB)

    return Image.fromarray(sketch_rgb)


def apply_oil_painting(image: Image.Image) -> Image.Image:
    """
    Aplica efeito realista de pintura a óleo (oil painting clássico).

    Pipeline:
    1. Suavização leve (preserva variação tonal)
    2. Oil Painting filter real (mistura local)
    3. Pinceladas direcionais sutis
    4. Contraste pictórico (não fotográfico)
    5. Compressão de highlights (peso de tinta)
    6. Sharpen mínimo
    """

    import cv2
    import numpy as np
    from PIL import Image

    # PIL -> OpenCV
    if image.mode == "RGBA":
        image = image.convert("RGB")

    img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # 1. Suavização leve (base pictórica)
    base = cv2.GaussianBlur(img, (0, 0), sigmaX=1.2)

    # 2. Oil Painting real (mistura local de cores)
    oil = cv2.xphoto.oilPainting(
        base,
        size=7,       # espessura do pincel
        dynRatio=1    # variação tonal natural
    )

    # 3. Pinceladas direcionais sutis (anisotropic feel)
    stroke = oil.astype(np.float32)

    for theta in (0, 45, 90, 135):
        kernel = cv2.getGaborKernel(
            ksize=(15, 15),
            sigma=4.0,
            theta=np.deg2rad(theta),
            lambd=10.0,
            gamma=0.6,
            psi=0
        )
        kernel /= kernel.sum() if kernel.sum() != 0 else 1
        stroke += cv2.filter2D(oil.astype(np.float32), -1, kernel) * 0.12

    stroke = np.clip(stroke, 0, 255).astype(np.uint8)

    # 4. Contraste pictórico (LAB)
    lab = cv2.cvtColor(stroke, cv2.COLOR_BGR2LAB)
    l_chan, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=1.2,      # MAIS SUTIL
        tileGridSize=(12, 12)
    )
    l_chan = clahe.apply(l_chan)

    # 5. Compressão de médios e highlights (peso de óleo)
    l_chan = np.clip(l_chan * 0.88, 0, 255).astype(np.uint8)

    oil_lab = cv2.merge((l_chan, a, b))
    oil_bgr = cv2.cvtColor(oil_lab, cv2.COLOR_LAB2BGR)

    # Compressão de tons claros (remove "lavado")
    oil_float = oil_bgr.astype(np.float32) / 255.0
    oil_float = np.power(oil_float, 1.15)
    oil_bgr = np.clip(oil_float * 255, 0, 255).astype(np.uint8)

    # 6. Sharpen mínimo (realça pinceladas, não bordas)
    kernel_sharp = np.array([
        [0, -0.25, 0],
        [-0.25, 2.0, -0.25],
        [0, -0.25, 0]
    ])
    oil_bgr = cv2.filter2D(oil_bgr, -1, kernel_sharp)
    oil_bgr = np.clip(oil_bgr, 0, 255).astype(np.uint8)

    # OpenCV -> PIL
    oil_rgb = cv2.cvtColor(oil_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(oil_rgb)


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

