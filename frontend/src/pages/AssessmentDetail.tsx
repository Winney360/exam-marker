import { useState, useEffect, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { Assessment, Question, ScriptUpload, AnalyticsData } from '../types/index.ts'

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [scripts, setScripts] = useState<ScriptUpload[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [qNumber, setQNumber] = useState('')
  const [qText, setQText] = useState('')
  const [qMax, setQMax] = useState('')
  const [qKeywords, setQKeywords] = useState('')

  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [marking, setMarking] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchData() {
    setLoading(true)
    try {
      const [a, q, s, an] = await Promise.all([
        api.get<Assessment>(`/assessments/${id}`),
        api.get<Question[]>(`/assessments/${id}/questions`),
        api.get<ScriptUpload[]>(`/assessments/${id}/scripts`).catch(() => [] as ScriptUpload[]),
        api.get<AnalyticsData>(`/assessments/${id}/analytics`).catch(() => null),
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
      max_marks: Number(qMax),
      memo_text: qText,
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

  async function handleDeleteScript(scriptId: string) {
    if (!window.confirm('Delete this script? This cannot be undone.')) return
    setDeleting(scriptId)
    try {
      await api.del(`/scripts/${scriptId}`)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
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

  async function handleProcess(scriptId: string) {
    setProcessing(scriptId)
    try {
      await api.post(`/scripts/${scriptId}/process`)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(null)
    }
  }

  async function handleMark(scriptId: string) {
    setMarking(scriptId)
    try {
      await api.post(`/scripts/${scriptId}/mark`)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setMarking(null)
    }
  }

  async function handleProcessAndMark(scriptId: string) {
    setProcessing(scriptId)
    try {
      await api.post(`/scripts/${scriptId}/process`)
      setProcessing(null)
      setMarking(scriptId)
      await api.post(`/scripts/${scriptId}/mark`)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(null)
      setMarking(null)
    }
  }

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>
  if (!assessment) return <div className="p-8 text-red-400">Assessment not found</div>

  return (
    <div className="p-8 space-y-8">
      <div>
        <Link to="/assessments" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">&larr; Assessments</Link>
        <h1 className="text-2xl font-bold text-slate-100 mt-1">{assessment.title}</h1>
        {assessment.description && (
          <p className="text-slate-400">{assessment.description}</p>
        )}
        <p className="text-sm text-slate-500">{assessment.max_mark} max marks</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-100">Questions</h2>
          <button
            type="button"
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {showQuestionForm ? 'Cancel' : '+ Add Question'}
          </button>
        </div>

        {showQuestionForm && (
          <form onSubmit={handleAddQuestion} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 mb-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">#</label>
                <input type="number" required min={1} value={qNumber} onChange={(e) => setQNumber(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Max Marks</label>
                <input type="number" required min={1} value={qMax} onChange={(e) => setQMax(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Keywords (comma-sep)</label>
                <input value={qKeywords} onChange={(e) => setQKeywords(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Memo Text (model answer)</label>
              <textarea required rows={2} value={qText} onChange={(e) => setQText(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40" />
            </div>
            <button type="submit" className="px-4 py-1.5 bg-teal-400 text-slate-900 rounded-lg text-sm font-semibold hover:bg-teal-300 transition-colors">
              Add
            </button>
          </form>
        )}

        {questions.length === 0 ? (
          <p className="text-slate-500 text-sm">No questions added yet</p>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <div key={q.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <span className="text-xs font-medium text-slate-500">Q{q.question_number}</span>
                  <p className="text-sm text-slate-200 mt-0.5">{q.memo_text}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {q.max_marks} marks &middot; Keywords: {q.keywords.join(', ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Upload Scripts</h2>
        <form onSubmit={handleUpload} className="flex items-center gap-3">
          <input
            type="file"
            name="file"
            accept="image/*,.pdf"
            required
            className="text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-400 file:text-slate-900 hover:file:bg-teal-300 file:transition-colors file:cursor-pointer"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-1.5 bg-teal-400 text-slate-900 rounded-lg text-sm font-semibold hover:bg-teal-300 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </section>

      {scripts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Scripts ({scripts.length})</h2>
          <div className="space-y-2">
            {scripts.map((s) => (
              <div key={s.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <Link
                    to={`/scripts/${s.id}`}
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {s.file_path.split('/').pop() || s.file_path.split('\\').pop() || 'Script'}
                  </Link>
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                    s.status === 'processing' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                    s.status === 'failed' ? 'bg-red-500/10 text-red-300 border border-red-500/20' :
                    'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                  }`}>
                    {s.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {s.file_type} &middot; {new Date(s.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleProcess(s.id)}
                    disabled={processing === s.id || s.status === 'processing'}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-50 transition-colors"
                  >
                    {processing === s.id ? 'Processing...' : 'Process'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMark(s.id)}
                    disabled={marking === s.id || s.status !== 'completed'}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                  >
                    {marking === s.id ? 'Marking...' : 'Mark'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProcessAndMark(s.id)}
                    disabled={processing === s.id || marking === s.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 disabled:opacity-50 transition-colors"
                  >
                    Process &amp; Mark
                  </button>
                  <Link
                    to={`/scripts/${s.id}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/40 text-slate-400 border border-slate-600/30 hover:bg-slate-700/60 hover:text-slate-300 transition-colors"
                  >
                    Review
                  </Link>
                  <Link
                    to={`/grading/${id}/${s.id}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors"
                  >
                    Grade
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteScript(s.id)}
                    disabled={deleting === s.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                  >
                    {deleting === s.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {analytics && (
        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Analytics</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-slate-100">{analytics.total_students}</p>
              <p className="text-xs text-slate-500">Students</p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-slate-100">{analytics.overall_average.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Average</p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-slate-100">{analytics.overall_median.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Median</p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-slate-100">{analytics.overall_std_dev.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Std Dev</p>
            </div>
          </div>
          <Link
            to={`/assessments/${id}/analytics`}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View detailed analytics &rarr;
          </Link>
        </section>
      )}
    </div>
  )
}
