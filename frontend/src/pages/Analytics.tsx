import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { AnalyticsData } from '../types/index.ts'

export default function Analytics() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.get<AnalyticsData>(`/assessments/${id}/analytics`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>
  if (!data) return <div className="p-8 text-red-500">Analytics not available</div>

  return (
    <div className="p-8 space-y-8">
      <div>
        <Link to={`/assessments/${id}`} className="text-sm text-indigo-600 hover:underline">&larr; Assessment</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Analytics</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.total_students}</p>
          <p className="text-xs text-gray-500 mt-1">Students</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.overall_average.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">Average</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.overall_median.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">Median</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.overall_std_dev.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">Std Dev</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Per-Question Breakdown</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Question</th>
                <th className="px-6 py-3 font-medium text-gray-500">Average</th>
                <th className="px-6 py-3 font-medium text-gray-500">Max Marks</th>
                <th className="px-6 py-3 font-medium text-gray-500">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {data.question_breakdown.map((q) => (
                <tr key={q.question_number} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Q{q.question_number}</td>
                  <td className="px-6 py-4 text-gray-600">{q.average_mark.toFixed(1)}</td>
                  <td className="px-6 py-4 text-gray-600">{q.max_marks}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      q.difficulty_index < 0.3
                        ? 'bg-red-100 text-red-700'
                        : q.difficulty_index < 0.6
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {(q.difficulty_index * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
