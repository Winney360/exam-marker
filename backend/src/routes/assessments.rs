use crate::services::assessment_service::{self, CreateAssessmentRequest};
use crate::AppState;
use axum::{extract::State, http::StatusCode, Json};
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
