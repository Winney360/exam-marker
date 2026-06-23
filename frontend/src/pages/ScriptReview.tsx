import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { MarkWithDetails } from '../types/index.ts'

export default function ScriptReview() {
  const { id } = useParams<{ id: string }>()
  const [marks, setMarks] = useState<MarkWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [overrides, setOverrides] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState<number | null>(null)

  async function fetchData() {
    setLoading(true)
    try {
      const data = await api.get<MarkWithDetails[]>(`/scripts/${id}/marks`)
      setMarks(data)
      const init: Record<number, string> = {}
      data.forEach((m) => { init[m.question_number] = String(m.teacher_final_mark) })
      setOverrides(init)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (id) fetchData() }, [id])

  async function handleOverride(m: MarkWithDetails) {
    const val = Number(overrides[m.question_number])
    if (isNaN(val) || val < 0) return
    setSaving(m.question_number)
    try {
      await api.put(`/marks/${m.id}`, {
        teacher_mark: val,
        override_reason: 'Teacher override',
      })
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(null)
    }
  }

  const totalAi = marks.reduce((s, m) => s + m.ai_suggested_mark, 0)
  const totalFinal = marks.reduce((s, m) => s + m.teacher_final_mark, 0)

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-8 space-y-6">
      <div>
        <Link to="/assessments" className="text-sm text-indigo-600 hover:underline">&larr; Assessments</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Script Review</h1>
        <p className="text-sm text-gray-500">Script ID: {id}</p>
      </div>

      {marks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No marks available. Process and mark this script first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {marks.map((m) => (
            <div key={m.question_number} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Question {m.question_number}</h3>
                <span className="text-sm text-gray-500">
                  {m.teacher_final_mark.toFixed(1)} / {m.ai_suggested_mark.toFixed(1)} (AI: {m.ai_suggested_mark.toFixed(1)})
                </span>
              </div>

              {m.is_override && (
                <p className="text-xs text-amber-600 mb-2">Overridden — AI suggested {m.ai_suggested_mark.toFixed(1)}</p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={overrides[m.question_number] ?? m.teacher_final_mark}
                  onChange={(e) =>
                    setOverrides((prev) => ({ ...prev, [m.question_number]: e.target.value }))
                  }
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleOverride(m)}
                  disabled={saving === m.question_number}
                  className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  {saving === m.question_number ? 'Saving...' : 'Override'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {marks.length > 0 && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5 text-center">
          <p className="text-sm text-indigo-600 font-medium">Totals</p>
          <p className="text-3xl font-bold text-indigo-700 mt-1">
            {totalFinal.toFixed(1)}
          </p>
          <p className="text-xs text-indigo-400 mt-1">
            AI suggested: {totalAi.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  )
}
