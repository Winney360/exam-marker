use crate::AppState;
use axum::{Json, extract::State};
use serde_json::json;

pub async fn health_check(State(state): State<AppState>) -> Json<serde_json::Value> {
    match state.db.acquire().await {
        Ok(_) => Json(json!({
            "status": "healthy",
            "database": "connected"
        })),
        Err(_) => Json(json!({
            "status": "degraded",
            "database": "disconnected"
        })),
    }
}
