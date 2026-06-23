import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { ScriptMarks, MarkDetail } from '../types/index.ts'

export default function ScriptReview() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ScriptMarks | null>(null)
  const [loading, setLoading] = useState(true)
  const [overrides, setOverrides] = useState<Record<number, string>>({})

  async function fetchData() {
    setLoading(true)
    try {
      const d = await api.get<ScriptMarks>(`/scripts/${id}/marks`)
      setData(d)
      const init: Record<number, string> = {}
      d.marks.forEach((m) => { init[m.question_number] = String(m.marks_achieved) })
      setOverrides(init)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (id) fetchData() }, [id])

  async function handleOverride(m: MarkDetail) {
    const val = Number(overrides[m.question_number])
    if (isNaN(val) || val < 0 || val > m.max_marks) return
    try {
      await api.put(`/marks/${data!.final_mark!.id}`, {
        total_marks_achieved: val,
      })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>
  if (!data) return <div className="p-8 text-red-500">Script not found</div>

  return (
    <div className="p-8 space-y-6">
      <div>
        <Link to="/assessments" className="text-sm text-indigo-600 hover:underline">&larr; Assessments</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Script Review</h1>
        <p className="text-sm text-gray-500">{data.script.filename}</p>
      </div>

      <div className="space-y-4">
        {data.marks.map((m) => (
          <div key={m.question_number} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Question {m.question_number}</h3>
              <span className="text-sm text-gray-500">{m.marks_achieved} / {m.max_marks}</span>
            </div>
            {m.details && Object.keys(m.details).length > 0 && (
              <pre className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-3 overflow-x-auto">
                {JSON.stringify(m.details, null, 2)}
              </pre>
            )}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={m.max_marks}
                value={overrides[m.question_number] ?? m.marks_achieved}
                onChange={(e) =>
                  setOverrides((prev) => ({ ...prev, [m.question_number]: e.target.value }))
                }
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                type="button"
                onClick={() => handleOverride(m)}
                className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 transition-colors"
              >
                Override
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.final_mark && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5 text-center">
          <p className="text-sm text-indigo-600 font-medium">
            {data.final_mark.is_override ? 'Overridden' : 'Auto'} Final Mark
          </p>
          <p className="text-3xl font-bold text-indigo-700 mt-1">
            {data.final_mark.total_marks_achieved} / {data.final_mark.total_max_marks}
          </p>
        </div>
      )}
    </div>
  )
}
