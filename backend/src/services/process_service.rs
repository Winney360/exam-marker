use std::path::Path;

use uuid::Uuid;

use crate::db::DbPool;
use crate::error::AppError;
use crate::models::ExtractedAnswer;
use crate::repositories::{answer_repo, assessment_repository, script_repo};
use crate::services::ocr_client::OcrClient;

pub async fn verify_script_ownership(
    pool: &DbPool,
    script_id: Uuid,
    teacher_id: Uuid,
) -> Result<(), AppError> {
    let script = script_repo::get_script(pool, script_id).await.map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::NotFound("Script not found".into()),
        other => AppError::Database(other),
    })?;
    assessment_repository::get_assessment(pool, script.assessment_id, teacher_id).await.map_err(|e| match e {
        sqlx::Error::RowNotFound => AppError::NotFound("Assessment not found".into()),
        other => AppError::Database(other),
    })?;
    Ok(())
}

pub async fn process_script(
    pool: &DbPool,
    ocr: &OcrClient,
    script_id: Uuid,
) -> Result<Vec<ExtractedAnswer>, AppError> {
    let script = script_repo::get_script(pool, script_id).await?;

    script_repo::update_script_status(pool, script_id, "processing").await?;

    let file_path = Path::new(&script.file_path);
    let ocr_response = ocr.extract(file_path).await?;

    let mut answers = Vec::new();

    for page in &ocr_response.pages {
        for q in &page.questions {
            let answer = answer_repo::create_answer(
                pool,
                script_id,
                q.number,
                &q.text,
                q.confidence as f32,
            )
            .await?;
            answers.push(answer);
        }
    }

    script_repo::update_script_status(pool, script_id, "completed").await?;

    Ok(answers)
}
