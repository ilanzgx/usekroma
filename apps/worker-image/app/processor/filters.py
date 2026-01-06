from PIL import Image, ImageFilter

def apply_sharpen(image: Image.Image) -> Image.Image:
    return image.filter(ImageFilter.SHARPEN)