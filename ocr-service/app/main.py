import os
import tempfile
from io import BytesIO

import cv2
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from pdf2image import convert_from_bytes

from .answer_splitter import split_answers
from .models import ErrorResponse, ExtractedQuestion, OcrResponse, PageResult
from .ocr_engine import extract_text

load_dotenv()

app = FastAPI(title="Rio OCR Service", version="0.1.0")


def process_image_bytes(data: bytes) -> tuple[str, float]:
    arr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(400, "Failed to decode image")
    return extract_text(img)


def process_pdf_bytes(data: bytes) -> list[tuple[str, float]]:
    images = convert_from_bytes(data)
    results: list[tuple[str, float]] = []
    for pil_img in images:
        arr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        text, conf = extract_text(arr)
        results.append((text, conf))
    return results


@app.post("/ocr/extract", response_model=OcrResponse)
async def ocr_extract(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(400, "No filename provided")

    contents = await file.read()
    if not contents:
        raise HTTPException(400, "Empty file")

    fname = file.filename.lower()
    is_pdf = fname.endswith(".pdf")
    image_exts = (".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".webp")
    is_image = any(fname.endswith(ext) for ext in image_exts)

    if not is_pdf and not is_image:
        raise HTTPException(400, f"Unsupported file type: {fname}")

    pages: list[PageResult] = []

    if is_pdf:
        page_results = process_pdf_bytes(contents)
        for i, (text, conf) in enumerate(page_results, start=1):
            questions = split_answers(text)
            pages.append(PageResult(page_num=i, raw_text=text, questions=questions))
    else:
        text, conf = process_image_bytes(contents)
        questions = split_answers(text)
        pages.append(PageResult(page_num=1, raw_text=text, questions=questions))

    return OcrResponse(pages=pages, total_pages=len(pages))


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("OCR_HOST", "127.0.0.1")
    port = int(os.getenv("OCR_PORT", "5001"))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
