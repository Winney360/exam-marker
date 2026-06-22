use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;

pub type DbPool = PgPool;

pub async fn create_pool(database_url: &str) -> Result<DbPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}

pub async fn run_migrations(pool: &DbPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS assessments (
            id UUID PRIMARY KEY,
            teacher_id UUID NOT NULL,
            title VARCHAR NOT NULL,
            description TEXT,
            max_mark INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL
        );
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        ALTER TABLE assessments
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS script_uploads (
            id UUID PRIMARY KEY,
            assessment_id UUID NOT NULL REFERENCES assessments(id),
            student_id UUID NOT NULL,
            file_path VARCHAR NOT NULL,
            file_type VARCHAR NOT NULL,
            status VARCHAR NOT NULL,
            created_at TIMESTAMPTZ NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL
        );
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        ALTER TABLE script_uploads
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS extracted_answers (
            id UUID PRIMARY KEY,
            script_id UUID NOT NULL REFERENCES script_uploads(id),
            question_number INTEGER NOT NULL,
            answer_text TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TIMESTAMPTZ NOT NULL
        );
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        ALTER TABLE extracted_answers
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS scoring_results (
            id UUID PRIMARY KEY,
            answer_id UUID NOT NULL REFERENCES extracted_answers(id),
            suggested_mark REAL NOT NULL,
            reasoning TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL
        );
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        ALTER TABLE scoring_results
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS final_marks (
            id UUID PRIMARY KEY,
            script_id UUID NOT NULL REFERENCES script_uploads(id),
            question_number INTEGER NOT NULL,
            ai_suggested_mark REAL NOT NULL,
            teacher_final_mark REAL NOT NULL,
            is_override BOOLEAN NOT NULL,
            override_reason TEXT,
            created_at TIMESTAMPTZ NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL
        );
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        ALTER TABLE final_marks
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'
        "#,
    )
    .execute(pool)
    .await?;

    Ok(())
}
