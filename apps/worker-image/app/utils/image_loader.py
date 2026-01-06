from PIL import Image
from io import BytesIO

IMAGES_FORMATS = {"JPEG", "PNG", "WEBP"}

def load_image_from_bytes(data: bytes):
    image = Image.open(BytesIO(data))

    if image.format not in IMAGES_FORMATS:
        raise ValueError("Invalid image format")

    if image.mode != "RGB":
        image = image.convert("RGB")

    return image
