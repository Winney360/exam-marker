import { useState, useEffect, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { Assessment, Question, ScriptUpload, Analytics } from '../types/index.ts'

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [scripts, setScripts] = useState<ScriptUpload[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [qNumber, setQNumber] = useState('')
  const [qText, setQText] = useState('')
  const [qMax, setQMax] = useState('')
  const [qKeywords, setQKeywords] = useState('')

  const [uploading, setUploading] = useState(false)

  async function fetchData() {
    setLoading(true)
    try {
      const [a, q, s, an] = await Promise.all([
        api.get<Assessment>(`/assessments/${id}`),
        api.get<Question[]>(`/assessments/${id}/questions`),
        api.get<ScriptUpload[]>(`/assessments/${id}/scripts`).catch(() => [] as ScriptUpload[]),
        api.get<Analytics>(`/assessments/${id}/analytics`).catch(() => null),
      ])
      setAssessment(a)
      setQuestions(q)
      setScripts(s)
      setAnalytics(an)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (id) fetchData() }, [id])

  async function handleAddQuestion(e: FormEvent) {
    e.preventDefault()
    await api.post(`/assessments/${id}/questions`, {
      question_number: Number(qNumber),
      question_text: qText,
      max_marks: Number(qMax),
      keywords: qKeywords.split(',').map((k) => k.trim()).filter(Boolean),
    })
    setQNumber('')
    setQText('')
    setQMax('')
    setQKeywords('')
    setShowQuestionForm(false)
    fetchData()
  }

  async function handleDeleteQuestion(qid: string) {
    await api.del(`/assessments/${id}/questions/${qid}`)
    fetchData()
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fileInput = form.elements.namedItem('file') as HTMLInputElement
    const file = fileInput.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await api.post(`/assessments/${id}/scripts`, fd)
      form.reset()
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>
  if (!assessment) return <div className="p-8 text-red-500">Assessment not found</div>

  return (
    <div className="p-8 space-y-8">
      <div>
        <Link to="/assessments" className="text-sm text-indigo-600 hover:underline">&larr; Assessments</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{assessment.title}</h1>
        <p className="text-gray-500">{assessment.subject} &middot; {assessment.total_marks} total marks</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
          <button
            type="button"
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {showQuestionForm ? 'Cancel' : '+ Add Question'}
          </button>
        </div>

        {showQuestionForm && (
          <form onSubmit={handleAddQuestion} className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">#</label>
                <input type="number" required min={1} value={qNumber} onChange={(e) => setQNumber(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Marks</label>
                <input type="number" required min={1} value={qMax} onChange={(e) => setQMax(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Keywords (comma-sep)</label>
                <input value={qKeywords} onChange={(e) => setQKeywords(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Question Text</label>
              <textarea required rows={2} value={qText} onChange={(e) => setQText(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
            </div>
            <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
              Add
            </button>
          </form>
        )}

        {questions.length === 0 ? (
          <p className="text-gray-400 text-sm">No questions added yet</p>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-400">Q{q.question_number}</span>
                  <p className="text-sm text-gray-900 mt-0.5">{q.question_text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {q.max_marks} marks &middot; Keywords: {q.keywords.join(', ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Upload Scripts</h2>
        <form onSubmit={handleUpload} className="flex items-center gap-3">
          <input
            type="file"
            name="file"
            accept="image/*,.pdf"
            required
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </section>

      {scripts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Scripts ({scripts.length})</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scripts.map((s) => (
              <Link
                key={s.id}
                to={`/scripts/${s.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <p className="text-sm font-medium text-gray-900 truncate">{s.filename}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(s.uploaded_at).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {analytics && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Analytics</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{analytics.overall_average.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Class Average</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{analytics.overall_median.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Median</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{analytics.overall_std_dev.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Std Dev</p>
            </div>
          </div>
          <Link
            to={`/assessments/${id}/analytics`}
            className="text-sm text-indigo-600 hover:underline"
          >
            View detailed analytics &rarr;
          </Link>
        </section>
      )}
    </div>
  )
}
