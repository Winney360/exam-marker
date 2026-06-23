use crate::db::DbPool;
use crate::models::Assessment;
use chrono::Utc;
use uuid::Uuid;

pub async fn create_assessment(
    pool: &DbPool,
    teacher_id: Uuid,
    title: String,
    description: Option<String>,
    max_mark: i32,
) -> Result<Assessment, sqlx::Error> {
    let id = Uuid::new_v4();
    let now = Utc::now();

    let assessment = sqlx::query_as::<_, Assessment>(
        r#"
        INSERT INTO assessments (id, teacher_id, title, description, max_mark, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, teacher_id, title, description, max_mark, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(teacher_id)
    .bind(title)
    .bind(description)
    .bind(max_mark)
    .bind(now)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(assessment)
}

pub async fn get_assessment(
    pool: &DbPool,
    id: Uuid,
    teacher_id: Uuid,
) -> Result<Assessment, sqlx::Error> {
    sqlx::query_as::<_, Assessment>(
        "SELECT id, teacher_id, title, description, max_mark, created_at, updated_at FROM assessments WHERE id = $1 AND teacher_id = $2",
    )
    .bind(id)
    .bind(teacher_id)
    .fetch_one(pool)
    .await
}

pub async fn list_assessments(
    pool: &DbPool,
    teacher_id: Uuid,
) -> Result<Vec<Assessment>, sqlx::Error> {
    sqlx::query_as::<_, Assessment>(
        "SELECT id, teacher_id, title, description, max_mark, created_at, updated_at FROM assessments WHERE teacher_id = $1 ORDER BY created_at DESC",
    )
    .bind(teacher_id)
    .fetch_all(pool)
    .await
}
