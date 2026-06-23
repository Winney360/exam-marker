use std::collections::HashSet;

use serde::Serialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::error::AppError;
use crate::models::Question;
use crate::repositories::{answer_repo, question_repo, score_repo};

#[derive(Debug, Serialize)]
pub struct MarkResult {
    pub question_number: i32,
    pub max_marks: i32,
    pub suggested_mark: f32,
    pub keyword_score_pct: f32,
    pub coverage_score_pct: f32,
    pub overlap_score_pct: f32,
    pub reasoning: String,
}

fn score_single_answer(student_text: &str, question: &Question) -> MarkResult {
    let student_lower = student_text.to_lowercase();
    let memo_lower = question.memo_text.to_lowercase();
    let max = question.max_marks as f32;

    let kw_count = question.keywords.len();
    let keyword_hits = question
        .keywords
        .iter()
        .filter(|kw| student_lower.contains(&kw.to_lowercase()))
        .count();
    let keyword_pct = if kw_count > 0 {
        keyword_hits as f32 / kw_count as f32
    } else {
        0.0
    };
    let keyword_mark = keyword_pct * max * 0.6;

    let coverage_pct = if memo_lower.len() > 0 {
        (student_lower.len() as f32 / memo_lower.len() as f32).min(1.0)
    } else {
        0.0
    };
    let coverage_mark = coverage_pct * max * 0.2;

    let student_words: HashSet<&str> = student_lower
        .split_whitespace()
        .filter(|w| w.len() > 2)
        .collect();
    let memo_words: HashSet<&str> = memo_lower
        .split_whitespace()
        .filter(|w| w.len() > 2)
        .collect();
    let overlap_pct = if !memo_words.is_empty() {
        student_words.intersection(&memo_words).count() as f32 / memo_words.len() as f32
    } else {
        0.0
    };
    let overlap_mark = overlap_pct * max * 0.2;

    let suggested = (keyword_mark + coverage_mark + overlap_mark).round().min(max);

    let reasoning = format!(
        "Keywords: {keyword_hits}/{kw_count} ({keyword_pct:.0}%) → {keyword_mark:.1}/{max:.0} ×0.6 | \
         Coverage: {coverage_pct:.0}% → {coverage_mark:.1}/{max:.0} ×0.2 | \
         Word overlap: {overlap_pct:.0}% → {overlap_mark:.1}/{max:.0} ×0.2 | \
         Total: {suggested:.1}/{max:.0}"
    );

    MarkResult {
        question_number: question.question_number,
        max_marks: question.max_marks,
        suggested_mark: suggested,
        keyword_score_pct: keyword_pct,
        coverage_score_pct: coverage_pct,
        overlap_score_pct: overlap_pct,
        reasoning,
    }
}

pub async fn mark_script(pool: &DbPool, script_id: Uuid) -> Result<Vec<MarkResult>, AppError> {
    let answers = answer_repo::get_answers_for_script(pool, script_id).await?;

    if answers.is_empty() {
        return Err(AppError::BadRequest(
            "No extracted answers found. Run OCR processing first.".into(),
        ));
    }

    let script = crate::repositories::script_repo::get_script(pool, script_id).await?;
    let questions = question_repo::get_questions_for_assessment(pool, script.assessment_id).await?;

    let mut results = Vec::new();

    for answer in &answers {
        let question = match questions.iter().find(|q| q.question_number == answer.question_number) {
            Some(q) => q,
            None => continue,
        };

        let result = score_single_answer(&answer.answer_text, question);

        score_repo::create_scoring_result(
            pool,
            answer.id,
            result.suggested_mark,
            &result.reasoning,
        )
        .await?;

        score_repo::upsert_final_mark(pool, script_id, result.question_number, result.suggested_mark)
            .await?;

        results.push(result);
    }

    Ok(results)
}
