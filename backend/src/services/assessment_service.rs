use crate::db::DbPool;
use crate::models::Assessment;
use crate::repositories::assessment_repository;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateAssessmentRequest {
    pub teacher_id: String,
    pub title: String,
    pub description: Option<String>,
    pub max_mark: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateAssessmentResponse {
    pub id: Uuid,
    pub teacher_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub max_mark: i32,
}

pub async fn create_assessment(
    pool: &DbPool,
    req: CreateAssessmentRequest,
) -> Result<CreateAssessmentResponse, String> {
    let teacher_id =
        Uuid::parse_str(&req.teacher_id).map_err(|e| format!("Invalid teacher_id: {}", e))?;

    let assessment = assessment_repository::create_assessment(
        pool,
        teacher_id,
        req.title,
        req.description,
        req.max_mark,
    )
    .await
    .map_err(|e| format!("Database error: {}", e))?;

    Ok(CreateAssessmentResponse {
        id: assessment.id,
        teacher_id: assessment.teacher_id,
        title: assessment.title,
        description: assessment.description,
        max_mark: assessment.max_mark,
    })
}
