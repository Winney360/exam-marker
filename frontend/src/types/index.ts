export interface Assessment {
  id: string
  title: string
  subject: string
  total_marks: number
  created_at: string
}

export interface Question {
  id: string
  assessment_id: string
  question_number: number
  question_text: string
  max_marks: number
  keywords: string[]
}

export interface ScriptUpload {
  id: string
  assessment_id: string
  filename: string
  file_path: string
  uploaded_at: string
}

export interface ExtractedAnswer {
  id: string
  script_id: string
  question_number: number
  extracted_text: string
  confidence: number
}

export interface MarkDetail {
  question_number: number
  marks_achieved: number
  max_marks: number
  details: Record<string, unknown>
}

export interface ScoringResult {
  id: string
  script_id: string
  question_number: number
  marks_achieved: number
  max_marks: number
  details: Record<string, unknown>
}

export interface FinalMark {
  id: string
  script_id: string
  total_marks_achieved: number
  total_max_marks: number
  is_override: boolean
  overridden_at: string | null
}

export interface ScriptMarks {
  script: ScriptUpload
  marks: MarkDetail[]
  final_mark: FinalMark | null
}

export interface Analytics {
  total_students: number
  overall_average: number
  overall_median: number
  overall_std_dev: number
  per_question: {
    question_number: number
    average: number
    max_marks: number
    difficulty_index: number
  }[]
}

export interface AuthResponse {
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}
