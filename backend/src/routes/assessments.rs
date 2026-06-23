use crate::error::AppError;
use crate::services::assessment_service::{self, CreateAssessmentRequest};
use crate::services::auth_service::AuthUser;
use crate::AppState;
use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde_json::json;
use uuid::Uuid;

pub async fn create_assessment(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(req): Json<CreateAssessmentRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), AppError> {
    let response = assessment_service::create_assessment(&state.db, auth.id, req).await?;

    Ok((
        StatusCode::CREATED,
        Json(json!({ "success": true, "data": response })),
    ))
}

pub async fn get_assessment(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let assessment = assessment_service::get_assessment(&state.db, id, auth.id).await?;

    Ok(Json(json!({ "success": true, "data": assessment })))
}

pub async fn list_assessments(
    State(state): State<AppState>,
    auth: AuthUser,
) -> Result<Json<serde_json::Value>, AppError> {
    let assessments = assessment_service::list_assessments(&state.db, auth.id).await?;

    Ok(Json(json!({ "success": true, "data": assessments })))
}
