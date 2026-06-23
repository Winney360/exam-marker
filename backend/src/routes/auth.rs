use axum::{Json, extract::State, http::StatusCode};
use serde_json::json;

use crate::error::AppError;
use crate::services::auth_service::{self, LoginRequest, RegisterRequest};
use crate::AppState;

pub async fn register(
    State(state): State<AppState>,
    Json(req): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), AppError> {
    let response = auth_service::register(&state.db, &state.config.jwt_secret, req).await?;

    Ok((
        StatusCode::CREATED,
        Json(json!({ "success": true, "data": response })),
    ))
}

pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    let response = auth_service::login(&state.db, &state.config.jwt_secret, req).await?;

    Ok(Json(json!({ "success": true, "data": response })))
}
