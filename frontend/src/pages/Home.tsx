import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'

export default function Home() {
  const { user } = useAuth()

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, {user.name}</h1>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      <header className="px-8 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-indigo-600">ExamMark AI</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-24 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 tracking-tight">
            Grade handwritten exams
            <br />
            <span className="text-indigo-600">in minutes, not hours</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500 leading-relaxed">
            ExamMark AI uses OCR to read handwritten answer scripts, auto-scores them against
            your marking scheme, and lets you review and adjust marks — all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3.5 text-base font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Scripts</h3>
            <p className="text-sm text-gray-500">
              Upload scanned images or PDFs of handwritten answer scripts. Batch upload
              supported.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Score</h3>
            <p className="text-sm text-gray-500">
              AI reads handwriting via OCR and scores answers against your keywords and model
              answer.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Override</h3>
            <p className="text-sm text-gray-500">
              Review AI-suggested marks, override where needed, and view analytics per
              question.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
