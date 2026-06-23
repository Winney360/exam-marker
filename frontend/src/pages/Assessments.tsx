import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.ts'
import type { Assessment } from '../types/index.ts'

export default function Assessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [totalMarks, setTotalMarks] = useState('')

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
      subject,
      total_marks: Number(totalMarks),
    })
    setTitle('')
    setSubject('')
    setTotalMarks('')
    setShowForm(false)
    fetchAll()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'New Assessment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
            <input
              type="number"
              required
              min={1}
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Create
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : assessments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No assessments yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 font-medium text-gray-500">Subject</th>
                <th className="px-6 py-3 font-medium text-gray-500">Total Marks</th>
                <th className="px-6 py-3 font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link to={`/assessments/${a.id}`} className="text-indigo-600 hover:underline font-medium">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{a.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{a.total_marks}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
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
