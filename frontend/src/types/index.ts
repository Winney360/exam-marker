export interface Assessment {
  id: string
  teacher_id: string
  title: string
  description: string | null
  max_mark: number
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  assessment_id: string
  question_number: number
  max_marks: number
  memo_text: string
  keywords: string[]
}

export interface ScriptUpload {
  id: string
  assessment_id: string
  student_id: string
  file_path: string
  file_type: string
  status: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user_id: string
  email: string
  name: string
  role: string
}

export interface MarkWithDetails {
  id: string
  script_id: string
  question_number: number
  ai_suggested_mark: number
  teacher_final_mark: number
  is_override: boolean
  override_reason: string | null
}

export interface MarkResult {
  question_number: number
  max_marks: number
  suggested_mark: number
  keyword_score_pct: number
  coverage_score_pct: number
  overlap_score_pct: number
  reasoning: string
}

export interface AnswerWithScore {
  answer_id: string
  script_id: string
  question_number: number
  answer_text: string
  confidence: number
  reasoning: string | null
  suggested_mark: number | null
}

export interface MarkScriptResponse {
  script_id: string
  marks: MarkResult[]
}

export interface QuestionBreakdown {
  question_number: number
  max_marks: number
  average_mark: number
  difficulty_index: number
  student_count: number
}

export interface AnalyticsData {
  assessment_id: string
  total_students: number
  total_questions: number
  overall_average: number
  overall_median: number
  overall_std_dev: number
  question_breakdown: QuestionBreakdown[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}
