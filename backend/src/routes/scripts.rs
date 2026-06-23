use axum::{
    extract::{Multipart, Path, State},
    Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::script_service;
use crate::AppState;

pub async fn list_scripts(
    State(state): State<AppState>,
    Path(assessment_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let scripts = script_service::list_scripts(&state.db, assessment_id).await?;

    Ok(Json(json!({ "success": true, "data": scripts })))
}

pub async fn upload_script(
    State(state): State<AppState>,
    Path(assessment_id): Path<Uuid>,
    mut multipart: Multipart,
) -> Result<Json<serde_json::Value>, AppError> {
    let mut file_bytes: Option<Vec<u8>> = None;
    let mut file_name: Option<String> = None;
    let mut student_id: Option<String> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::BadRequest(format!("Invalid multipart: {}", e)))?
    {
        let name = field.name().unwrap_or("").to_string();
        match name.as_str() {
            "file" => {
                file_name = field.file_name().map(|s| s.to_string());
                file_bytes = Some(
                    field
                        .bytes()
                        .await
                        .map_err(|e| AppError::BadRequest(format!("Failed to read file: {}", e)))?
                        .to_vec(),
                );
            }
            "student_id" => {
                student_id = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| AppError::BadRequest(format!("Failed to read student_id: {}", e)))?,
                );
            }
            _ => {}
        }
    }

    let bytes = file_bytes.ok_or_else(|| AppError::BadRequest("No file provided".into()))?;
    let fname = file_name.unwrap_or_else(|| "unnamed".to_string());

    let script = script_service::upload_script(
        &state.db,
        &state.config.upload_dir,
        assessment_id,
        bytes,
        &fname,
        student_id.as_deref(),
    )
    .await?;

    Ok(Json(json!({
        "success": true,
        "data": {
            "id": script.id,
            "assessment_id": script.assessment_id,
            "student_id": script.student_id,
            "file_path": script.file_path,
            "file_type": script.file_type,
            "status": script.status
        }
    })))
}
