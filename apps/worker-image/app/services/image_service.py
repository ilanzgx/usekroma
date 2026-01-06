from app.processor.filters import apply_sharpen
from PIL import Image

def process_image(image: Image.Image, operation: str) -> Image.Image:
    if operation == "sharpen" :
        return apply_sharpen(image)

    raise ValueError("Incorrect operation")