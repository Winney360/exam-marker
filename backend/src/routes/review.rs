use axum::{
    Json,
    extract::{Path, State},
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::review_service::{self, OverrideMarkRequest};
use crate::AppState;

pub async fn get_marks(
    State(state): State<AppState>,
    Path(script_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let marks = review_service::get_marks(&state.db, script_id).await?;

    Ok(Json(json!({ "success": true, "data": marks })))
}

pub async fn override_mark(
    State(state): State<AppState>,
    Path(mark_id): Path<Uuid>,
    Json(req): Json<OverrideMarkRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    let mark = review_service::override_mark(&state.db, mark_id, req).await?;

    Ok(Json(json!({ "success": true, "data": mark })))
}
