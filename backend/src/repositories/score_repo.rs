use chrono::Utc;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::{FinalMark, ScoringResult};

pub async fn create_scoring_result(
    pool: &DbPool,
    answer_id: Uuid,
    suggested_mark: f32,
    reasoning: &str,
) -> Result<ScoringResult, sqlx::Error> {
    let id = Uuid::new_v4();
    let now = Utc::now();

    let result = sqlx::query_as::<_, ScoringResult>(
        r#"
        INSERT INTO scoring_results (id, answer_id, suggested_mark, reasoning, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, answer_id, suggested_mark, reasoning, created_at
        "#,
    )
    .bind(id)
    .bind(answer_id)
    .bind(suggested_mark)
    .bind(reasoning)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(result)
}

pub async fn get_marks_for_script(
    pool: &DbPool,
    script_id: Uuid,
) -> Result<Vec<FinalMark>, sqlx::Error> {
    sqlx::query_as::<_, FinalMark>(
        "SELECT id, script_id, question_number, ai_suggested_mark, teacher_final_mark, is_override, override_reason, created_at, updated_at FROM final_marks WHERE script_id = $1 ORDER BY question_number",
    )
    .bind(script_id)
    .fetch_all(pool)
    .await
}

pub async fn upsert_final_mark(
    pool: &DbPool,
    script_id: Uuid,
    question_number: i32,
    ai_suggested_mark: f32,
) -> Result<FinalMark, sqlx::Error> {
    let now = Utc::now();

    let existing = sqlx::query_as::<_, FinalMark>(
        "SELECT id, script_id, question_number, ai_suggested_mark, teacher_final_mark, is_override, override_reason, created_at, updated_at FROM final_marks WHERE script_id = $1 AND question_number = $2",
    )
    .bind(script_id)
    .bind(question_number)
    .fetch_optional(pool)
    .await?;

    if let Some(mut mark) = existing {
        mark.ai_suggested_mark = ai_suggested_mark;
        if !mark.is_override {
            mark.teacher_final_mark = ai_suggested_mark;
        }
        mark.updated_at = now;

        let updated = sqlx::query_as::<_, FinalMark>(
            r#"
            UPDATE final_marks
            SET ai_suggested_mark = $1, teacher_final_mark = $2, updated_at = $3
            WHERE id = $4
            RETURNING id, script_id, question_number, ai_suggested_mark, teacher_final_mark, is_override, override_reason, created_at, updated_at
            "#,
        )
        .bind(mark.ai_suggested_mark)
        .bind(mark.teacher_final_mark)
        .bind(now)
        .bind(mark.id)
        .fetch_one(pool)
        .await?;

        Ok(updated)
    } else {
        let id = Uuid::new_v4();

        let created = sqlx::query_as::<_, FinalMark>(
            r#"
            INSERT INTO final_marks (id, script_id, question_number, ai_suggested_mark, teacher_final_mark, is_override, override_reason, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, false, NULL, $6, $7)
            RETURNING id, script_id, question_number, ai_suggested_mark, teacher_final_mark, is_override, override_reason, created_at, updated_at
            "#,
        )
        .bind(id)
        .bind(script_id)
        .bind(question_number)
        .bind(ai_suggested_mark)
        .bind(ai_suggested_mark)
        .bind(now)
        .bind(now)
        .fetch_one(pool)
        .await?;

        Ok(created)
    }
}
