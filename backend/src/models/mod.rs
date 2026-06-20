use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Assessment {
    pub id: Uuid,
    pub teacher_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub max_mark: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ScriptUpload {
    pub id: Uuid,
    pub assessment_id: Uuid,
    pub student_id: Uuid,
    pub file_path: String,
    pub file_type: String, // "pdf" or "image"
    pub status: String,    // "pending", "processing", "completed", "failed"
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ExtractedAnswer {
    pub id: Uuid,
    pub script_id: Uuid,
    pub question_number: i32,
    pub answer_text: String,
    pub confidence: f32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ScoringResult {
    pub id: Uuid,
    pub answer_id: Uuid,
    pub suggested_mark: f32,
    pub reasoning: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FinalMark {
    pub id: Uuid,
    pub script_id: Uuid,
    pub question_number: i32,
    pub ai_suggested_mark: f32,
    pub teacher_final_mark: f32,
    pub is_override: bool,
    pub override_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
