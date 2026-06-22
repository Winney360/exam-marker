use crate::AppState;
use crate::services::assessment_service::{self, CreateAssessmentRequest};
use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde_json::json;

pub async fn create_assessment(
    State(state): State<AppState>,
    Json(req): Json<CreateAssessmentRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, String)> {
    match assessment_service::create_assessment(&state.db, req).await {
        Ok(response) => Ok((
            StatusCode::CREATED,
            Json(json!({
                "success": true,
                "data": response
            })),
        )),
        Err(e) => Err((StatusCode::BAD_REQUEST, e)),
    }
}

pub async fn get_assessment(
    State(state): State<AppState>,
    Path(id): Path<uuid::Uuid>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, String)> {
    match assessment_service::get_assessment(&state.db, id).await {
        Ok(assessment) => Ok((
            StatusCode::OK,
            Json(json!({
                "success": true,
                "data": assessment
            })),
        )),
        Err(e) if e == "Assessment not found" => Err((StatusCode::NOT_FOUND, e)),
        Err(e) => Err((StatusCode::BAD_REQUEST, e)),
    }
}
