from pydantic import BaseModel


class ExtractedQuestion(BaseModel):
    number: int
    text: str
    confidence: float


class PageResult(BaseModel):
    page_num: int
    raw_text: str
    questions: list[ExtractedQuestion]


class OcrResponse(BaseModel):
    pages: list[PageResult]
    total_pages: int


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
