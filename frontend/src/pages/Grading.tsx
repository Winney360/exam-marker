import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import { api } from '../api/client.ts'
import type { Question, AnswerWithScore, MarkWithDetails } from '../types/index.ts'

export default function Grading() {
  const { assessmentId, scriptId } = useParams<{ assessmentId: string; scriptId: string }>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<AnswerWithScore[]>([])
  const [marks, setMarks] = useState<MarkWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [overrideVal, setOverrideVal] = useState('')
  const [saving, setSaving] = useState(false)

  async function fetchData() {
    if (!assessmentId || !scriptId) return
    setLoading(true)
    try {
      const [qData, aData, mData] = await Promise.all([
        api.get<Question[]>(`/assessments/${assessmentId}/questions`),
        api.get<AnswerWithScore[]>(`/scripts/${scriptId}/answers`),
        api.get<MarkWithDetails[]>(`/scripts/${scriptId}/marks`),
      ])
      setQuestions(qData.sort((a, b) => a.question_number - b.question_number))
      setAnswers(aData.sort((a, b) => a.question_number - b.question_number))
      setMarks(mData.sort((a, b) => a.question_number - b.question_number))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [assessmentId, scriptId])

  useEffect(() => {
    const currentMark = marks[currentQ]
    setOverrideVal(currentMark ? String(currentMark.teacher_final_mark) : '')
  }, [currentQ, marks])

  function markForQ(qn: number) {
    return marks.find((m) => m.question_number === qn)
  }

  function answerForQ(qn: number) {
    return answers.find((a) => a.question_number === qn)
  }

  function questionForQ(qn: number) {
    return questions.find((q) => q.question_number === qn)
  }

  async function handleSave() {
    const m = marks[currentQ]
    if (!m || saving) return
    const val = Number(overrideVal)
    if (isNaN(val) || val < 0) return
    setSaving(true)
    try {
      await api.put(`/marks/${m.id}`, {
        teacher_mark: val,
        override_reason: val !== m.ai_suggested_mark ? 'Teacher override' : null,
      })
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  const currentQuestion = questionForQ(questions[currentQ]?.question_number ?? 0)
  const currentAnswer = answerForQ(questions[currentQ]?.question_number ?? 0)
  const currentMark = markForQ(questions[currentQ]?.question_number ?? 0)

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to={`/assessments/${assessmentId}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <Logo className="w-9 h-9" />
            <span className="hidden sm:inline">Grading</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
            Script {scriptId?.slice(0, 8)}...
          </span>
          {currentMark && (
            <span className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
              currentMark.is_override
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentMark.is_override ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {currentMark.is_override ? 'Overridden' : 'Auto'}
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 text-xs font-bold text-slate-300">
                  {currentQuestion?.question_number ?? '?'}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Student Answer</h2>
                  <p className="text-xs text-slate-500">
                    Question {currentQuestion?.question_number ?? '?'} &middot; {currentQuestion?.max_marks ?? '?'} marks
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/40">
              <pre className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {currentAnswer?.answer_text || 'No answer extracted'}
              </pre>
            </div>
            {currentAnswer && (
              <p className="text-xs text-slate-600 mt-3">
                OCR confidence: {Math.round(currentAnswer.confidence * 100)}%
              </p>
            )}
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-slate-100">AI Assessment</h2>
            </div>
            {currentAnswer?.reasoning ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/40">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{currentAnswer.reasoning}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No AI assessment available. Process and mark this script first.</p>
            )}
            {currentAnswer?.suggested_mark != null && currentQuestion && (
              <div className="mt-3 text-xs text-slate-500">
                AI score: <span className="text-slate-300 font-mono">{currentAnswer.suggested_mark}/{currentQuestion.max_marks}</span>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-300">Q{currentQuestion?.question_number ?? '?'}</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-100">Question Reference</h2>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/40">
              <pre className="text-sm text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
                {currentQuestion?.memo_text || 'No question data'}
              </pre>
            </div>
            {currentQuestion && currentQuestion.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentQuestion.keywords.map((kw) => (
                  <span key={kw} className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-slate-100">Final Score</h2>
              {currentMark && (
                <div className="text-xs text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-700/50">
                  AI suggested: <span className="text-slate-300 font-mono">{currentMark.ai_suggested_mark}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setOverrideVal(String(Math.max(0, (Number(overrideVal) || 0) - 1)))}
                className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </button>
              <div className="text-center">
                <span className="text-6xl font-bold text-slate-100 tabular-nums tracking-tight">
                  {overrideVal || '0'}
                </span>
                <span className="text-lg text-slate-500 font-mono">
                  /{currentQuestion?.max_marks ?? '?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOverrideVal(String(Math.min(currentQuestion?.max_marks ?? 99, (Number(overrideVal) || 0) + 1)))}
                className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
              </button>
            </div>
            <div className="w-full bg-slate-800/40 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                style={{ width: `${currentQuestion ? (Number(overrideVal) / currentQuestion.max_marks) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>0</span>
              <span className="text-slate-400">{currentQuestion ? Math.round((Number(overrideVal) / currentQuestion.max_marks) * 100) : 0}%</span>
              <span>{currentQuestion?.max_marks ?? '?'}</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !currentMark}
              className="w-full py-4 px-6 rounded-2xl bg-teal-400 text-slate-900 font-semibold text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:bg-teal-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {saving ? 'Saving...' : 'Save Mark'}
            </button>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>
              <span className="text-xs text-slate-500">
                Question {currentQ + 1} of {questions.length}
              </span>
              <button
                type="button"
                disabled={currentQ >= questions.length - 1}
                onClick={() => setCurrentQ((p) => Math.min(questions.length - 1, p + 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
