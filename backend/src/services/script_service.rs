use std::path::Path;

use uuid::Uuid;

use crate::db::DbPool;
use crate::error::AppError;
use crate::models::ScriptUpload;
use crate::repositories::script_repo;

fn detect_file_type(file_name: &str) -> String {
    let lower = file_name.to_lowercase();
    if lower.ends_with(".pdf") {
        "pdf".to_string()
    } else if lower.ends_with(".png")
        || lower.ends_with(".jpg")
        || lower.ends_with(".jpeg")
        || lower.ends_with(".tiff")
        || lower.ends_with(".bmp")
    {
        "image".to_string()
    } else {
        "unknown".to_string()
    }
}

pub async fn upload_script(
    pool: &DbPool,
    upload_dir: &str,
    assessment_id: Uuid,
    file_bytes: Vec<u8>,
    file_name: &str,
    student_id: Option<&str>,
) -> Result<ScriptUpload, AppError> {
    let student_uuid = match student_id {
        Some(s) => Uuid::parse_str(s).map_err(|_| AppError::BadRequest("Invalid student_id UUID".into()))?,
        None => Uuid::new_v4(),
    };

    let file_type = detect_file_type(file_name);

    let script_id = Uuid::new_v4();

    let ext = Path::new(file_name)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("bin");

    let sub_dir = format!("{}/{}", upload_dir, assessment_id);
    let save_path = format!("{}/{}.{}", sub_dir, script_id, ext);

    tokio::fs::create_dir_all(&sub_dir)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to create upload directory: {}", e)))?;

    tokio::fs::write(&save_path, &file_bytes)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to save file: {}", e)))?;

    let script = script_repo::create_script(pool, script_id, assessment_id, student_uuid, &save_path, &file_type)
        .await?;

    Ok(script)
}
