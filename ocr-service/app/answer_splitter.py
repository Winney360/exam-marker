import re

from .models import ExtractedQuestion


QUESTION_PATTERNS = [
    re.compile(r"^Q(?:uestion)?\s*(\d+)\s*[. )]\s*", re.MULTILINE | re.IGNORECASE),
    re.compile(r"^(\d+)\s*[.)]\s+", re.MULTILINE),
]


def split_answers(text: str) -> list[ExtractedQuestion]:
    lines = text.split("\n")
    questions: list[ExtractedQuestion] = []
    current_num: int | None = None
    current_lines: list[str] = []
    current_conf: float = 1.0

    def flush() -> None:
        nonlocal current_num, current_lines, current_conf
        if current_num is not None and current_lines:
            q_text = " ".join(current_lines).strip()
            if q_text:
                questions.append(ExtractedQuestion(
                    number=current_num,
                    text=q_text,
                    confidence=round(current_conf, 2),
                ))

    for line in lines:
        matched = False
        for pattern in QUESTION_PATTERNS:
            m = pattern.match(line.strip())
            if m:
                flush()
                current_num = int(m.group(1))
                remainder = line[m.end():].strip()
                current_lines = [remainder] if remainder else []
                current_conf = 1.0
                matched = True
                break

        if not matched:
            current_lines.append(line.strip())

    flush()

    if not questions:
        text = " ".join(lines).strip()
        if text:
            questions.append(ExtractedQuestion(number=1, text=text, confidence=1.0))

    return questions
