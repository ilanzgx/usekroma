from io import BytesIO
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.services.image_service import process_image

client = TestClient(app)

def create_sample_image(width=100, height=100, mode="RGB", color=(255, 0, 0)) -> Image.Image:
    """Cria uma imagem de teste em memória."""
    return Image.new(mode, (width, height), color=color)

def image_to_bytes(image: Image.Image) -> bytes:
    """Converte uma imagem PIL para bytes PNG."""
    buf = BytesIO()
    image.save(buf, format="PNG")
    return buf.getvalue()

def test_process_image_transformations():
    """Testa transformações diretas no serviço de imagem."""
    img = create_sample_image(120, 80)
    
    # Teste de resize
    resized = process_image(img, "resize", {"width": 60, "height": 40})
    assert resized.size == (60, 40)
    
    # Teste de grayscale
    gray = process_image(img, "grayscale")
    assert gray.size == (120, 80)
    
    # Teste de flip horizontal
    flipped = process_image(img, "flip_horizontal")
    assert flipped.size == (120, 80)

    # Teste de sharpen
    sharp = process_image(img, "sharpen")
    assert sharp.size == (120, 80)

def test_process_endpoint():
    """Testa o endpoint POST /process com upload de imagem."""
    img = create_sample_image(50, 50)
    img_bytes = image_to_bytes(img)
    
    response = client.post(
        "/process",
        data={"operation": "grayscale"},
        files={"file": ("test.png", img_bytes, "image/png")}
    )
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 0
    
    # Verifica se o resultado é uma imagem válida decodificável
    result_img = Image.open(BytesIO(response.content))
    assert result_img.size == (50, 50)
