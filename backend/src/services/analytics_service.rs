use serde::Serialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::error::AppError;
use crate::repositories::{question_repo, score_repo, script_repo};

#[derive(Debug, Serialize)]
pub struct QuestionBreakdown {
    pub question_number: i32,
    pub max_marks: i32,
    pub average_mark: f64,
    pub difficulty_index: f64,
    pub student_count: i32,
}

#[derive(Debug, Serialize)]
pub struct AnalyticsResponse {
    pub assessment_id: Uuid,
    pub total_students: i32,
    pub total_questions: i32,
    pub overall_average: f64,
    pub overall_median: f64,
    pub overall_std_dev: f64,
    pub question_breakdown: Vec<QuestionBreakdown>,
}

pub async fn get_analytics(
    pool: &DbPool,
    assessment_id: Uuid,
) -> Result<AnalyticsResponse, AppError> {
    let scripts = script_repo::get_scripts_for_assessment(pool, assessment_id).await?;
    let questions = question_repo::get_questions_for_assessment(pool, assessment_id).await?;

    let mut student_totals: Vec<f64> = Vec::new();
    let mut per_q_sums: Vec<f64> = vec![0.0; questions.len()];
    let mut per_q_counts: Vec<i32> = vec![0; questions.len()];

    let q_map: std::collections::HashMap<i32, usize> = questions
        .iter()
        .enumerate()
        .map(|(i, q)| (q.question_number, i))
        .collect();

    for script in &scripts {
        let marks = score_repo::get_marks_for_script(pool, script.id).await?;
        let total: f64 = marks.iter().map(|m| m.teacher_final_mark as f64).sum();
        student_totals.push(total);

        for mark in &marks {
            if let Some(&idx) = q_map.get(&mark.question_number) {
                per_q_sums[idx] += mark.teacher_final_mark as f64;
                per_q_counts[idx] += 1;
            }
        }
    }

    let count = student_totals.len() as f64;
    let overall_average = if count > 0.0 {
        student_totals.iter().sum::<f64>() / count
    } else {
        0.0
    };

    student_totals.sort_unstable_by(|a, b| a.partial_cmp(b).unwrap());
    let overall_median = if !student_totals.is_empty() {
        let mid = student_totals.len() / 2;
        if student_totals.len() % 2 == 0 {
            (student_totals[mid - 1] + student_totals[mid]) / 2.0
        } else {
            student_totals[mid]
        }
    } else {
        0.0
    };

    let overall_std_dev = if count > 0.0 {
        let variance = student_totals
            .iter()
            .map(|s| (s - overall_average).powi(2))
            .sum::<f64>()
            / count;
        variance.sqrt()
    } else {
        0.0
    };

    let question_breakdown: Vec<QuestionBreakdown> = questions
        .iter()
        .enumerate()
        .map(|(i, q)| {
            let avg = if per_q_counts[i] > 0 {
                per_q_sums[i] / per_q_counts[i] as f64
            } else {
                0.0
            };
            let max = q.max_marks as f64;
            let difficulty = if max > 0.0 { avg / max } else { 0.0 };

            QuestionBreakdown {
                question_number: q.question_number,
                max_marks: q.max_marks,
                average_mark: (avg * 100.0).round() / 100.0,
                difficulty_index: (difficulty * 100.0).round() / 100.0,
                student_count: per_q_counts[i],
            }
        })
        .collect();

    Ok(AnalyticsResponse {
        assessment_id,
        total_students: scripts.len() as i32,
        total_questions: questions.len() as i32,
        overall_average: (overall_average * 100.0).round() / 100.0,
        overall_median: (overall_median * 100.0).round() / 100.0,
        overall_std_dev: (overall_std_dev * 100.0).round() / 100.0,
        question_breakdown,
    })
}
