use crate::db::DbPool;
use crate::error::AppError;
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
) -> Result<CreateAssessmentResponse, AppError> {
    let teacher_id = Uuid::parse_str(&req.teacher_id)
        .map_err(|_| AppError::BadRequest("Invalid teacher_id UUID".into()))?;

    let assessment = assessment_repository::create_assessment(
        pool,
        teacher_id,
        req.title,
        req.description,
        req.max_mark,
    )
    .await?;

    Ok(CreateAssessmentResponse {
        id: assessment.id,
        teacher_id: assessment.teacher_id,
        title: assessment.title,
        description: assessment.description,
        max_mark: assessment.max_mark,
    })
}

pub async fn get_assessment(pool: &DbPool, id: Uuid) -> Result<crate::models::Assessment, AppError> {
    assessment_repository::get_assessment(pool, id).await.map_err(|e| {
        match e {
            sqlx::Error::RowNotFound => AppError::NotFound("Assessment not found".into()),
            other => AppError::Database(other),
        }
    })
}
