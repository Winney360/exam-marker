use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::question_service::{self, CreateQuestionRequest, UpdateQuestionRequest};
use crate::AppState;

pub async fn create_question(
    State(state): State<AppState>,
    Path(assessment_id): Path<Uuid>,
    Json(req): Json<CreateQuestionRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), AppError> {
    let question = question_service::create_question(&state.db, assessment_id, req).await?;

    Ok((
        StatusCode::CREATED,
        Json(json!({ "success": true, "data": question })),
    ))
}

pub async fn list_questions(
    State(state): State<AppState>,
    Path(assessment_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let questions = question_service::list_questions(&state.db, assessment_id).await?;

    Ok(Json(json!({ "success": true, "data": questions })))
}

pub async fn update_question(
    State(state): State<AppState>,
    Path((_assessment_id, question_id)): Path<(Uuid, Uuid)>,
    Json(req): Json<UpdateQuestionRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    let question = question_service::update_question(&state.db, question_id, req).await?;

    Ok(Json(json!({ "success": true, "data": question })))
}

pub async fn delete_question(
    State(state): State<AppState>,
    Path((_assessment_id, question_id)): Path<(Uuid, Uuid)>,
) -> Result<(StatusCode, Json<serde_json::Value>), AppError> {
    question_service::delete_question(&state.db, question_id).await?;

    Ok((
        StatusCode::OK,
        Json(json!({ "success": true, "data": null })),
    ))
}
