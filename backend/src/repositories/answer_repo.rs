use chrono::Utc;
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

#[allow(dead_code)]
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
