import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { Assessment } from '../types/index.ts'

export default function Dashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Assessment[]>('/assessments')
      .then(setAssessments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8 text-slate-400">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <Link
          to="/assessments"
          className="px-5 py-2.5 bg-teal-400 text-slate-900 rounded-xl hover:bg-teal-300 transition-colors text-sm font-semibold shadow-lg shadow-teal-500/25"
        >
          New Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg text-slate-400">No assessments yet</p>
          <p className="text-sm mt-1 text-slate-600">Create your first assessment to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((a) => (
            <Link
              key={a.id}
              to={`/assessments/${a.id}`}
              className="block bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
            >
              <h2 className="font-semibold text-slate-100 truncate">{a.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{a.max_mark} max marks</p>
              <p className="text-xs text-slate-600 mt-3">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
