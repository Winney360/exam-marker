use chrono::Utc;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::User;

pub async fn create_user(
    pool: &DbPool,
    email: &str,
    password_hash: &str,
    name: &str,
    role: &str,
) -> Result<User, sqlx::Error> {
    let id = Uuid::new_v4();
    let now = Utc::now();

    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, password_hash, name, role, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(email)
    .bind(password_hash)
    .bind(name)
    .bind(role)
    .bind(now)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(user)
}

pub async fn find_user_by_email(pool: &DbPool, email: &str) -> Result<Option<User>, sqlx::Error> {
    let user = sqlx::query_as::<_, User>(
        "SELECT id, email, password_hash, name, role, created_at, updated_at FROM users WHERE email = $1",
    )
    .bind(email)
    .fetch_optional(pool)
    .await?;

    Ok(user)
}
