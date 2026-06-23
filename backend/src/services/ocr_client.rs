use std::path::Path;

use reqwest::multipart;
use serde::Deserialize;

use crate::error::AppError;

#[derive(Debug, Deserialize)]
pub struct OcrQuestion {
    pub number: i32,
    pub text: String,
    pub confidence: f64,
}

#[derive(Debug, Deserialize)]
pub struct OcrPage {
    pub page_num: i32,
    pub raw_text: String,
    pub questions: Vec<OcrQuestion>,
}

#[derive(Debug, Deserialize)]
pub struct OcrResponse {
    pub pages: Vec<OcrPage>,
    pub total_pages: i32,
}

#[derive(Clone)]
pub struct OcrClient {
    client: reqwest::Client,
    base_url: String,
}

impl OcrClient {
    pub fn new(base_url: String) -> Self {
        Self {
            client: reqwest::Client::new(),
            base_url,
        }
    }

    pub async fn extract(&self, file_path: &Path) -> Result<OcrResponse, AppError> {
        let url = format!("{}/ocr/extract", self.base_url);

        let file_bytes = tokio::fs::read(file_path)
            .await
            .map_err(|e| AppError::Internal(format!("We couldn't read the file for OCR processing. It may have been moved or deleted. ({})", e)))?;

        let file_name = file_path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("file")
            .to_string();

        let file_part = multipart::Part::bytes(file_bytes)
            .file_name(file_name)
            .mime_str("application/octet-stream")
            .map_err(|e| AppError::Internal(format!("We couldn't prepare the file for OCR processing. ({})", e)))?;

        let form = multipart::Form::new().part("file", file_part);

        let resp = self
            .client
            .post(&url)
            .multipart(form)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("We couldn't reach the OCR processing service. Please try again. ({})", e)))?;

        if !resp.status().is_success() {
            let status = resp.status();
            return Err(AppError::Internal(format!(
                "The OCR service encountered an error (status {status}). Please try again later."
            )));
        }

        let ocr_response: OcrResponse = resp
            .json()
            .await
            .map_err(|e| AppError::Internal(format!("We couldn't understand the response from the OCR service. ({})", e)))?;

        Ok(ocr_response)
    }
}
