use axum::{
    Json,
    extract::{Path, State},
};
use serde_json::json;
use uuid::Uuid;

use crate::error::AppError;
use crate::services::auth_service::AuthUser;
use crate::services::process_service;
use crate::services::scoring_service;
use crate::AppState;

pub async fn mark_script(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(script_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    process_service::verify_script_ownership(&state.db, script_id, auth.id).await?;
    let results = scoring_service::mark_script(&state.db, script_id).await?;

    Ok(Json(json!({
        "success": true,
        "data": {
            "script_id": script_id,
            "marks": results
        }
    })))
}
