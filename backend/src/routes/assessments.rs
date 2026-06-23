use crate::error::AppError;
use crate::services::assessment_service::{self, CreateAssessmentRequest};
use crate::AppState;
use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde_json::json;

pub async fn create_assessment(
    State(state): State<AppState>,
    Json(req): Json<CreateAssessmentRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), AppError> {
    let response = assessment_service::create_assessment(&state.db, req).await?;

    Ok((
        StatusCode::CREATED,
        Json(json!({ "success": true, "data": response })),
    ))
}

pub async fn get_assessment(
    State(state): State<AppState>,
    Path(id): Path<uuid::Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let assessment = assessment_service::get_assessment(&state.db, id).await?;

    Ok(Json(json!({ "success": true, "data": assessment })))
}
