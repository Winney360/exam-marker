use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db::DbPool;
use crate::error::AppError;
use crate::models::FinalMark;
use crate::repositories::{answer_repo, assessment_repository, score_repo, script_repo};

pub async fn verify_mark_ownership(
    pool: &DbPool,
    mark_id: Uuid,
    teacher_id: Uuid,
) -> Result<(), AppError> {
    let mark = score_repo::get_mark_by_id(pool, mark_id).await.map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::NotFound("We couldn't find this mark. It may have been deleted.".into()),
        other => AppError::Database(other),
    })?;
    let script = script_repo::get_script(pool, mark.script_id).await.map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::NotFound("We couldn't find this script. It may have been deleted.".into()),
        other => AppError::Database(other),
    })?;
    assessment_repository::get_assessment(pool, script.assessment_id, teacher_id).await.map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::NotFound("We couldn't find this assessment. It may have been deleted.".into()),
        other => AppError::Database(other),
    })?;
    Ok(())
}

#[derive(Debug, Serialize)]
pub struct MarkWithDetails {
    pub id: Uuid,
    pub script_id: Uuid,
    pub question_number: i32,
    pub ai_suggested_mark: f32,
    pub teacher_final_mark: f32,
    pub is_override: bool,
    pub override_reason: Option<String>,
}

impl From<FinalMark> for MarkWithDetails {
    fn from(m: FinalMark) -> Self {
        Self {
            id: m.id,
            script_id: m.script_id,
            question_number: m.question_number,
            ai_suggested_mark: m.ai_suggested_mark,
            teacher_final_mark: m.teacher_final_mark,
            is_override: m.is_override,
            override_reason: m.override_reason,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct OverrideMarkRequest {
    pub teacher_mark: f32,
    pub override_reason: Option<String>,
}

pub async fn get_marks(pool: &DbPool, script_id: Uuid) -> Result<Vec<MarkWithDetails>, AppError> {
    let marks = score_repo::get_marks_for_script(pool, script_id).await?;
    Ok(marks.into_iter().map(MarkWithDetails::from).collect())
}

pub async fn override_mark(
    pool: &DbPool,
    mark_id: Uuid,
    req: OverrideMarkRequest,
) -> Result<MarkWithDetails, AppError> {
    score_repo::get_mark_by_id(pool, mark_id)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => AppError::NotFound("We couldn't find this mark. It may have been deleted.".into()),
            other => AppError::Database(other),
        })?;

    let updated =
        score_repo::override_final_mark(pool, mark_id, req.teacher_mark, req.override_reason.as_deref())
            .await?;

    Ok(MarkWithDetails::from(updated))
}

pub async fn get_answers(
    pool: &DbPool,
    script_id: Uuid,
) -> Result<Vec<answer_repo::AnswerWithScore>, AppError> {
    let answers = answer_repo::get_answers_with_scores(pool, script_id).await?;
    Ok(answers)
}
