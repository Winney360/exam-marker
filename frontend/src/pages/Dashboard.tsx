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
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/assessments"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          New Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No assessments yet</p>
          <p className="text-sm mt-1">Create your first assessment to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((a) => (
            <Link
              key={a.id}
              to={`/assessments/${a.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-gray-900 truncate">{a.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{a.subject}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
