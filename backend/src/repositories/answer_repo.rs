use chrono::Utc;
use serde::Serialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::ExtractedAnswer;

pub async fn create_answer(
    pool: &DbPool,
    script_id: Uuid,
    question_number: i32,
    answer_text: &str,
    confidence: f32,
) -> Result<ExtractedAnswer, sqlx::Error> {
    let id = Uuid::new_v4();
    let now = Utc::now();

    let answer = sqlx::query_as::<_, ExtractedAnswer>(
        r#"
        INSERT INTO extracted_answers (id, script_id, question_number, answer_text, confidence, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, script_id, question_number, answer_text, confidence, created_at
        "#,
    )
    .bind(id)
    .bind(script_id)
    .bind(question_number)
    .bind(answer_text)
    .bind(confidence)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(answer)
}

pub async fn get_answers_for_script(
    pool: &DbPool,
    script_id: Uuid,
) -> Result<Vec<ExtractedAnswer>, sqlx::Error> {
    sqlx::query_as::<_, ExtractedAnswer>(
        "SELECT id, script_id, question_number, answer_text, confidence, created_at FROM extracted_answers WHERE script_id = $1 ORDER BY question_number",
    )
    .bind(script_id)
    .fetch_all(pool)
    .await
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct AnswerWithScore {
    pub answer_id: Uuid,
    pub script_id: Uuid,
    pub question_number: i32,
    pub answer_text: String,
    pub confidence: f32,
    pub reasoning: Option<String>,
    pub suggested_mark: Option<f32>,
}

pub async fn get_answers_with_scores(
    pool: &DbPool,
    script_id: Uuid,
) -> Result<Vec<AnswerWithScore>, sqlx::Error> {
    sqlx::query_as::<_, AnswerWithScore>(
        r#"
        SELECT
            ea.id AS answer_id,
            ea.script_id,
            ea.question_number,
            ea.answer_text,
            ea.confidence,
            sr.reasoning,
            sr.suggested_mark
        FROM extracted_answers ea
        LEFT JOIN scoring_results sr ON sr.answer_id = ea.id
        WHERE ea.script_id = $1
        ORDER BY ea.question_number
        "#,
    )
    .bind(script_id)
    .fetch_all(pool)
    .await
}
