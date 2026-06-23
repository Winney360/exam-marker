use axum::{
    Json,
    extract::{Path, State},
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::process_service;
use crate::AppState;

pub async fn process_script(
    State(state): State<AppState>,
    Path(script_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let answers = process_service::process_script(&state.db, &state.ocr, script_id).await?;

    Ok(Json(json!({
        "success": true,
        "data": {
            "script_id": script_id,
            "answers": answers
        }
    })))
}
