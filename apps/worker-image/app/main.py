from io import BytesIO

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import Response

from app.utils.image_loader import load_image_from_bytes
from app.services.image_service import process_image

app = FastAPI()

@app.post("/process")
async def process_endpoint(file: UploadFile = File(...), operation: str = Form(...)):
    try:
        data = await file.read()
        image = load_image_from_bytes(data)
        image = process_image(image=image, operation=operation)

        buffer = BytesIO()
        image.save(buffer, format="PNG")

        return Response(content=buffer.getvalue(), media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))