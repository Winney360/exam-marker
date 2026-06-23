use axum::{
    Json,
    extract::{Path, State},
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::auth_service::AuthUser;
use crate::services::process_service;
use crate::services::review_service::{self, OverrideMarkRequest};
use crate::AppState;

pub async fn get_marks(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(script_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    process_service::verify_script_ownership(&state.db, script_id, auth.id).await?;
    let marks = review_service::get_marks(&state.db, script_id).await?;

    Ok(Json(json!({ "success": true, "data": marks })))
}

pub async fn override_mark(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(mark_id): Path<Uuid>,
    Json(req): Json<OverrideMarkRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    review_service::verify_mark_ownership(&state.db, mark_id, auth.id).await?;
    let mark = review_service::override_mark(&state.db, mark_id, req).await?;

    Ok(Json(json!({ "success": true, "data": mark })))
}

pub async fn get_answers(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(script_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    process_service::verify_script_ownership(&state.db, script_id, auth.id).await?;
    let answers = review_service::get_answers(&state.db, script_id).await?;

    Ok(Json(json!({ "success": true, "data": answers })))
}
