use axum::{
    Json,
    extract::{Path, State},
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::analytics_service;
use crate::AppState;

pub async fn get_analytics(
    State(state): State<AppState>,
    Path(assessment_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let analytics = analytics_service::get_analytics(&state.db, assessment_id).await?;

    Ok(Json(json!({ "success": true, "data": analytics })))
}
