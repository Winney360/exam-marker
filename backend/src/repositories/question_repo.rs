use chrono::Utc;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::Question;

pub async fn create_question(
    pool: &DbPool,
    assessment_id: Uuid,
    question_number: i32,
    max_marks: i32,
    memo_text: &str,
    keywords: &[String],
) -> Result<Question, sqlx::Error> {
    let id = Uuid::new_v4();
    let now = Utc::now();

    let question = sqlx::query_as::<_, Question>(
        r#"
        INSERT INTO questions (id, assessment_id, question_number, max_marks, memo_text, keywords, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, assessment_id, question_number, max_marks, memo_text, keywords, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(assessment_id)
    .bind(question_number)
    .bind(max_marks)
    .bind(memo_text)
    .bind(keywords)
    .bind(now)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(question)
}

pub async fn get_questions_for_assessment(
    pool: &DbPool,
    assessment_id: Uuid,
) -> Result<Vec<Question>, sqlx::Error> {
    sqlx::query_as::<_, Question>(
        "SELECT id, assessment_id, question_number, max_marks, memo_text, keywords, created_at, updated_at FROM questions WHERE assessment_id = $1 ORDER BY question_number",
    )
    .bind(assessment_id)
    .fetch_all(pool)
    .await
}

pub async fn get_question(
    pool: &DbPool,
    id: Uuid,
) -> Result<Question, sqlx::Error> {
    sqlx::query_as::<_, Question>(
        "SELECT id, assessment_id, question_number, max_marks, memo_text, keywords, created_at, updated_at FROM questions WHERE id = $1",
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_question(
    pool: &DbPool,
    id: Uuid,
    max_marks: i32,
    memo_text: &str,
    keywords: &[String],
) -> Result<Question, sqlx::Error> {
    let now = Utc::now();

    let question = sqlx::query_as::<_, Question>(
        r#"
        UPDATE questions
        SET max_marks = $1, memo_text = $2, keywords = $3, updated_at = $4
        WHERE id = $5
        RETURNING id, assessment_id, question_number, max_marks, memo_text, keywords, created_at, updated_at
        "#,
    )
    .bind(max_marks)
    .bind(memo_text)
    .bind(keywords)
    .bind(now)
    .bind(id)
    .fetch_one(pool)
    .await?;

    Ok(question)
}

pub async fn delete_question(pool: &DbPool, id: Uuid) -> Result<(), sqlx::Error> {
    sqlx::query("DELETE FROM questions WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}
