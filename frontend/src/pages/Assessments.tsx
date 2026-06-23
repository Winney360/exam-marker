import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { Assessment } from '../types/index.ts'

export default function Assessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [maxMark, setMaxMark] = useState('')

  async function fetchAll() {
    setLoading(true)
    try {
      const data = await api.get<Assessment[]>('/assessments')
      setAssessments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await api.post('/assessments', {
      title,
      description: description || null,
      max_mark: Number(maxMark),
    })
    setTitle('')
    setDescription('')
    setMaxMark('')
    setShowForm(false)
    fetchAll()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Assessments</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-teal-400 text-slate-900 rounded-xl hover:bg-teal-300 transition-colors text-sm font-semibold shadow-lg shadow-teal-500/25"
        >
          {showForm ? 'Cancel' : 'New Assessment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
              placeholder="Assessment title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Max Marks</label>
            <input
              type="number"
              required
              min={1}
              value={maxMark}
              onChange={(e) => setMaxMark(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
              placeholder="e.g. 100"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-400 text-slate-900 rounded-xl hover:bg-teal-300 transition-colors text-sm font-semibold shadow-lg shadow-teal-500/25"
          >
            Create
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : assessments.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg text-slate-400">No assessments yet</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/60 text-left">
                <th className="px-6 py-4 font-medium text-slate-400">Title</th>
                <th className="px-6 py-4 font-medium text-slate-400">Description</th>
                <th className="px-6 py-4 font-medium text-slate-400">Max Marks</th>
                <th className="px-6 py-4 font-medium text-slate-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/assessments/${a.id}`} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{a.description || '—'}</td>
                  <td className="px-6 py-4 text-slate-400">{a.max_mark}</td>
                  <td className="px-6 py-4 text-slate-600 text-xs">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
