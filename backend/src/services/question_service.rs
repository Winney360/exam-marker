use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db::DbPool;
use crate::error::AppError;
use crate::models::Question;
use crate::repositories::question_repo;

#[derive(Debug, Deserialize)]
pub struct CreateQuestionRequest {
    pub question_number: i32,
    pub max_marks: i32,
    pub memo_text: String,
    pub keywords: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateQuestionRequest {
    pub max_marks: i32,
    pub memo_text: String,
    pub keywords: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct QuestionResponse {
    pub id: Uuid,
    pub assessment_id: Uuid,
    pub question_number: i32,
    pub max_marks: i32,
    pub memo_text: String,
    pub keywords: Vec<String>,
}

impl From<Question> for QuestionResponse {
    fn from(q: Question) -> Self {
        Self {
            id: q.id,
            assessment_id: q.assessment_id,
            question_number: q.question_number,
            max_marks: q.max_marks,
            memo_text: q.memo_text,
            keywords: q.keywords,
        }
    }
}

pub async fn create_question(
    pool: &DbPool,
    assessment_id: Uuid,
    req: CreateQuestionRequest,
) -> Result<QuestionResponse, AppError> {
    let question = question_repo::create_question(
        pool,
        assessment_id,
        req.question_number,
        req.max_marks,
        &req.memo_text,
        &req.keywords,
    )
    .await?;

    Ok(QuestionResponse::from(question))
}

pub async fn list_questions(
    pool: &DbPool,
    assessment_id: Uuid,
) -> Result<Vec<QuestionResponse>, AppError> {
    let questions = question_repo::get_questions_for_assessment(pool, assessment_id).await?;
    Ok(questions.into_iter().map(QuestionResponse::from).collect())
}

pub async fn update_question(
    pool: &DbPool,
    id: Uuid,
    req: UpdateQuestionRequest,
) -> Result<QuestionResponse, AppError> {
    let question = question_repo::update_question(pool, id, req.max_marks, &req.memo_text, &req.keywords)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("Question not found".into()),
            other => AppError::Database(other),
        })?;

    Ok(QuestionResponse::from(question))
}

pub async fn delete_question(
    pool: &DbPool,
    id: Uuid,
) -> Result<(), AppError> {
    question_repo::delete_question(pool, id).await?;
    Ok(())
}
