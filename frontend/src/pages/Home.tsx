import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'



function UploadIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="120" height="100" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
      <rect x="56" y="46" width="50" height="6" rx="3" fill="#1e293b" />
      <rect x="56" y="58" width="36" height="6" rx="3" fill="#1e293b" />
      <rect x="56" y="76" width="70" height="4" rx="2" fill="#1e293b" />
      <rect x="56" y="86" width="56" height="4" rx="2" fill="#1e293b" />
      <rect x="56" y="96" width="80" height="4" rx="2" fill="#1e293b" />
      <circle cx="140" cy="110" r="20" fill="url(#upload-grad)" />
      <path d="M134 110l6-6 6 6M140 104v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="upload-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ScoreIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="50" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
      <circle cx="100" cy="80" r="34" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.5" />
      <circle cx="100" cy="80" r="18" fill="url(#score-grad)" />
      <path d="M92 80l5 5 10-10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="56" cy="52" r="4" fill="#14b8a6" fillOpacity="0.4" />
      <circle cx="150" cy="50" r="3" fill="#06b6d4" fillOpacity="0.35" />
      <circle cx="148" cy="118" r="5" fill="#14b8a6" fillOpacity="0.3" />
      <circle cx="52" cy="114" r="3" fill="#06b6d4" fillOpacity="0.35" />
      <defs>
        <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ReviewIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="25" width="90" height="110" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
      <rect x="55" y="25" width="90" height="18" rx="8" fill="url(#review-grad)" />
      <circle cx="76" cy="34" r="3" fill="#fff" fillOpacity="0.6" />
      <circle cx="84" cy="34" r="3" fill="#fff" fillOpacity="0.6" />
      <circle cx="92" cy="34" r="3" fill="#fff" fillOpacity="0.6" />
      <rect x="70" y="56" width="30" height="6" rx="3" fill="#1e293b" />
      <rect x="70" y="70" width="50" height="4" rx="2" fill="#1e293b" />
      <rect x="70" y="82" width="40" height="4" rx="2" fill="#1e293b" />
      <rect x="128" y="95" width="24" height="6" rx="2" fill="#f59e0b" transform="rotate(-30 128 95)" />
      <rect x="135" y="88" width="6" height="12" rx="1" fill="#fbbf24" transform="rotate(-30 135 88)" />
      <defs>
        <linearGradient id="review-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function AnalyticsIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="130" width="8" height="30" rx="2" fill="#1e293b" />
      <rect x="48" y="110" width="8" height="50" rx="2" fill="#14b8a6" fillOpacity="0.5" />
      <rect x="66" y="80" width="8" height="80" rx="2" fill="#14b8a6" fillOpacity="0.7" />
      <rect x="84" y="100" width="8" height="60" rx="2" fill="#06b6d4" fillOpacity="0.5" />
      <rect x="102" y="70" width="8" height="90" rx="2" fill="url(#chart-grad)" />
      <rect x="120" y="90" width="8" height="70" rx="2" fill="#14b8a6" fillOpacity="0.5" />
      <rect x="138" y="115" width="8" height="45" rx="2" fill="#1e293b" />
      <rect x="156" y="85" width="8" height="75" rx="2" fill="#f59e0b" fillOpacity="0.6" />
      <path d="M52 115l30-25 24 30 22-50 24 20 24-15" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.8" />
      <circle cx="128" cy="75" r="4" fill="#14b8a6" />
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Welcome back, {user.name}</h1>
          <p className="text-slate-500 mb-8">Pick up where you left off.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-400 hover:to-teal-500 transition-all font-medium shadow-lg shadow-cyan-500/25"
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
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-100">Rio</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-5 py-2 rounded-xl hover:from-cyan-400 hover:to-teal-500 transition-all shadow-lg shadow-cyan-500/25"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative pt-16 pb-20 px-6 sm:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero.jpeg"
              alt=""
              className="w-full h-full object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
              <span className="text-white">Grade handwritten exams</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">
                at the speed of AI
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Stop spending weekends grading. Upload scanned answer scripts, let OCR extract
              and score them against your marking scheme, then review and finalize marks in
              minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-400 hover:to-teal-500 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                Start grading free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-slate-200 bg-slate-900/60 backdrop-blur-md border border-slate-700/80 rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-slate-800/60 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-slate-100">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                Everything you need to grade exams
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                From upload to final mark, we handle the heavy lifting.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map(({ Illustration, title, desc }) => (
                <div
                  key={title}
                  className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
                >
                  <div className="w-full max-w-[160px] mb-6">
                    <Illustration />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-slate-900/30 px-6 sm:px-8 border-y border-slate-800/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                How it works
              </h2>
              <p className="mt-4 text-lg text-slate-500">Three simple steps to grade an exam.</p>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="hidden md:block absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-cyan-500/30 via-teal-500/50 to-cyan-500/30" />
              {steps.map((s) => (
                <div key={s.step} className="relative text-center">
                  <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}>
                    <span className="text-lg font-bold text-white">{s.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative rounded-3xl p-12 sm:p-16 shadow-2xl overflow-hidden border border-slate-800/60"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(20,184,166,0.08))',
                backdropFilter: 'blur(12px)',
              }}>
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/5" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-teal-500/5" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                  Ready to save hours on grading?
                </h2>
                <p className="mt-4 text-lg text-slate-400">
                  Get started for free. No credit card required.
                </p>
                <div className="mt-8">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-400 hover:to-teal-500 transition-all shadow-xl shadow-cyan-500/25"
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
      <footer className="border-t border-slate-800/60 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-300">Rio</span>
          </div>
          <p className="text-sm text-slate-600">Built for teachers who deserve better tools.</p>
        </div>
      </footer>
    </div>
  )
}
