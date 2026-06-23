import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 340" fill="none" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="280" height="200" rx="16" fill="url(#hero-grad)" className="drop-shadow-xl" />
      <rect x="80" y="60" width="100" height="8" rx="4" fill="#fff" fillOpacity="0.4" />
      <rect x="80" y="80" width="80" height="8" rx="4" fill="#fff" fillOpacity="0.25" />
      <rect x="80" y="110" width="140" height="6" rx="3" fill="#fff" fillOpacity="0.15" />
      <rect x="80" y="126" width="120" height="6" rx="3" fill="#fff" fillOpacity="0.15" />
      <rect x="80" y="142" width="160" height="6" rx="3" fill="#fff" fillOpacity="0.15" />
      <rect x="80" y="170" width="50" height="50" rx="10" fill="#fff" fillOpacity="0.15" />
      <rect x="142" y="180" width="100" height="6" rx="3" fill="#fff" fillOpacity="0.12" />
      <rect x="142" y="194" width="70" height="6" rx="3" fill="#fff" fillOpacity="0.12" />
      <circle cx="280" cy="170" r="32" fill="#fff" fillOpacity="0.2" />
      <path d="M268 170l8 8 16-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.9" />
      {/* Decorative dots */}
      <circle cx="48" cy="48" r="4" fill="#6366f1" fillOpacity="0.3" />
      <circle cx="352" cy="32" r="6" fill="#6366f1" fillOpacity="0.2" />
      <circle cx="370" cy="180" r="3" fill="#6366f1" fillOpacity="0.25" />
      <circle cx="30" cy="200" r="5" fill="#a855f7" fillOpacity="0.2" />
      <circle cx="340" cy="260" r="4" fill="#6366f1" fillOpacity="0.15" />
      <circle cx="60" cy="280" r="3" fill="#a855f7" fillOpacity="0.2" />
      {/* Bottom bar chart */}
      <rect x="70" y="265" width="24" height="40" rx="4" fill="#6366f1" fillOpacity="0.3" />
      <rect x="102" y="240" width="24" height="65" rx="4" fill="#6366f1" fillOpacity="0.5" />
      <rect x="134" y="255" width="24" height="50" rx="4" fill="#a855f7" fillOpacity="0.4" />
      <rect x="166" y="225" width="24" height="80" rx="4" fill="#6366f1" fillOpacity="0.6" />
      <rect x="198" y="250" width="24" height="55" rx="4" fill="#6366f1" fillOpacity="0.3" />
      <rect x="230" y="235" width="24" height="70" rx="4" fill="#a855f7" fillOpacity="0.5" />
      <rect x="262" y="260" width="24" height="45" rx="4" fill="#6366f1" fillOpacity="0.35" />
      <defs>
        <linearGradient id="hero-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function UploadIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="120" height="100" rx="12" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="2" />
      <rect x="56" y="46" width="50" height="6" rx="3" fill="#c7d2fe" />
      <rect x="56" y="58" width="36" height="6" rx="3" fill="#c7d2fe" />
      <rect x="56" y="76" width="70" height="4" rx="2" fill="#e0e7ff" />
      <rect x="56" y="86" width="56" height="4" rx="2" fill="#e0e7ff" />
      <rect x="56" y="96" width="80" height="4" rx="2" fill="#e0e7ff" />
      {/* Upload arrow */}
      <circle cx="140" cy="110" r="20" fill="#6366f1" />
      <path d="M134 110l6-6 6 6M140 104v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ScoreIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="50" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="2" />
      <circle cx="100" cy="80" r="34" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="100" cy="80" r="18" fill="#c7d2fe" />
      <path d="M92 80l5 5 10-10" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="56" cy="52" r="4" fill="#a5b4fc" fillOpacity="0.6" />
      <circle cx="150" cy="50" r="3" fill="#a5b4fc" fillOpacity="0.5" />
      <circle cx="148" cy="118" r="5" fill="#a5b4fc" fillOpacity="0.4" />
      <circle cx="52" cy="114" r="3" fill="#a5b4fc" fillOpacity="0.5" />
    </svg>
  )
}

function ReviewIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="25" width="90" height="110" rx="8" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="2" />
      <rect x="55" y="25" width="90" height="18" rx="8" fill="#6366f1" />
      <circle cx="76" cy="34" r="3" fill="#fff" fillOpacity="0.6" />
      <circle cx="84" cy="34" r="3" fill="#fff" fillOpacity="0.6" />
      <circle cx="92" cy="34" r="3" fill="#fff" fillOpacity="0.6" />
      <rect x="70" y="56" width="30" height="6" rx="3" fill="#c7d2fe" />
      <rect x="70" y="70" width="50" height="4" rx="2" fill="#e0e7ff" />
      <rect x="70" y="82" width="40" height="4" rx="2" fill="#e0e7ff" />
      {/* Pencil */}
      <rect x="128" y="95" width="24" height="6" rx="2" fill="#a855f7" transform="rotate(-30 128 95)" />
      <rect x="135" y="88" width="6" height="12" rx="1" fill="#c084fc" transform="rotate(-30 135 88)" />
    </svg>
  )
}

function AnalyticsIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="130" width="8" height="30" rx="2" fill="#e0e7ff" />
      <rect x="48" y="110" width="8" height="50" rx="2" fill="#a5b4fc" />
      <rect x="66" y="80" width="8" height="80" rx="2" fill="#818cf8" />
      <rect x="84" y="100" width="8" height="60" rx="2" fill="#a5b4fc" />
      <rect x="102" y="70" width="8" height="90" rx="2" fill="#6366f1" />
      <rect x="120" y="90" width="8" height="70" rx="2" fill="#a5b4fc" />
      <rect x="138" y="115" width="8" height="45" rx="2" fill="#e0e7ff" />
      <rect x="156" y="85" width="8" height="75" rx="2" fill="#a855f7" />
      {/* Line */}
      <path d="M52 115l30-25 24 30 22-50 24 20 24-15" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.8" />
      {/* Dot */}
      <circle cx="128" cy="75" r="4" fill="#6366f1" />
    </svg>
  )
}

const features = [
  {
    Illustration: UploadIllustration,
    title: 'Upload Scripts',
    desc: 'Drop scanned images or PDFs of handwritten answer scripts. We handle batch uploads and automatic file organization per assessment.',
  },
  {
    Illustration: ScoreIllustration,
    title: 'Auto-Score',
    desc: 'AI-powered OCR extracts handwritten answers and scores them against your marking scheme — keywords, model answer coverage, and word overlap.',
  },
  {
    Illustration: ReviewIllustration,
    title: 'Review & Override',
    desc: 'See exactly how each answer was scored. Override any mark with a click, and we track your changes vs the AI suggestion.',
  },
  {
    Illustration: AnalyticsIllustration,
    title: 'Analytics',
    desc: 'Per-question difficulty analysis, class averages, median scores, and standard deviation — know exactly how your students performed.',
  },
]

const stats = [
  { label: 'OCR Accuracy', value: '95%' },
  { label: 'Avg. Processing', value: '< 3s' },
  { label: 'Batch Size', value: 'Unlimited' },
  { label: 'Export Formats', value: 'CSV/PDF' },
]

const steps = [
  {
    step: '01',
    title: 'Create & Upload',
    desc: 'Set up an assessment with your marking scheme, then upload scanned answer scripts as PDFs or images.',
  },
  {
    step: '02',
    title: 'Process & Score',
    desc: 'Our OCR engine reads handwriting, splits answers by question, and scores each one against your keywords and model answer.',
  },
  {
    step: '03',
    title: 'Review & Export',
    desc: 'Review AI-suggested marks, override where needed, check per-question analytics, and export final results.',
  },
]

export default function Home() {
  const { user } = useAuth()

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}</h1>
          <p className="text-gray-500 mb-8">Pick up where you left off.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
          >
            Go to Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">ExamMark</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 sm:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-sm font-medium text-indigo-700 mb-8">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                  AI-Powered Grading
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                  Grade handwritten exams{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    at the speed of AI
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
                  Stop spending weekends grading. Upload scanned answer scripts, let OCR extract
                  and score them against your marking scheme, then review and finalize marks in
                  minutes.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200 hover:shadow-indigo-300"
                  >
                    Start grading free
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Sign in
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex justify-center lg:justify-end">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-gray-100 bg-gray-50/80">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Everything you need to grade exams
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                From upload to final mark, we handle the heavy lifting.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map(({ Illustration, title, desc }) => (
                <div
                  key={title}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
                >
                  <div className="w-full max-w-[160px] mb-6">
                    <Illustration />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-gray-50 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                How it works
              </h2>
              <p className="mt-4 text-lg text-gray-500">Three simple steps to grade an exam.</p>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connector line */}
              <div className="hidden md:block absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200" />
              {steps.map((s) => (
                <div key={s.step} className="relative text-center">
                  <div className="relative z-10 w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
                    <span className="text-lg font-bold text-white">{s.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 sm:p-16 shadow-2xl overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Ready to save hours on grading?
                </h2>
                <p className="mt-4 text-lg text-indigo-200">
                  Get started for free. No credit card required.
                </p>
                <div className="mt-8">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
                  >
                    Start grading free
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">ExamMark</span>
          </div>
          <p className="text-sm text-gray-400">Built for teachers who deserve better tools.</p>
        </div>
      </footer>
    </div>
  )
}
