use chrono::Utc;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::ScriptUpload;

pub async fn create_script(
    pool: &DbPool,
    id: Uuid,
    assessment_id: Uuid,
    student_id: Uuid,
    file_path: &str,
    file_type: &str,
) -> Result<ScriptUpload, sqlx::Error> {
    let now = Utc::now();
    let status = "pending";

    let script = sqlx::query_as::<_, ScriptUpload>(
        r#"
        INSERT INTO script_uploads (id, assessment_id, student_id, file_path, file_type, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, assessment_id, student_id, file_path, file_type, status, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(assessment_id)
    .bind(student_id)
    .bind(file_path)
    .bind(file_type)
    .bind(status)
    .bind(now)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(script)
}

pub async fn get_script(pool: &DbPool, id: Uuid) -> Result<ScriptUpload, sqlx::Error> {
    sqlx::query_as::<_, ScriptUpload>(
        "SELECT id, assessment_id, student_id, file_path, file_type, status, created_at, updated_at FROM script_uploads WHERE id = $1",
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_script_status(
    pool: &DbPool,
    id: Uuid,
    status: &str,
) -> Result<(), sqlx::Error> {
    let now = Utc::now();
    sqlx::query(
        "UPDATE script_uploads SET status = $1, updated_at = $2 WHERE id = $3",
    )
    .bind(status)
    .bind(now)
    .bind(id)
    .execute(pool)
    .await?;
    Ok(())
}
