import pytesseract
from PIL import Image
import numpy as np

from .preprocessor import preprocess_image


def extract_text(image: np.ndarray, lang: str = "eng") -> tuple[str, float]:
    processed = preprocess_image(image)

    custom_config = r"--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:'\"()-[]{}/\\%@"

    text = pytesseract.image_to_string(processed, lang=lang, config=custom_config)

    confidence_data = pytesseract.image_to_data(processed, lang=lang, config=custom_config, output_type=pytesseract.Output.DICT)
    conf_values = [c for c in confidence_data["conf"] if c != "-1"]
    avg_confidence = sum(conf_values) / len(conf_values) / 100.0 if conf_values else 0.0

    return text.strip(), avg_confidence
