import { useState } from 'react'

const question = {
  number: 3,
  maxMarks: 10,
  text: `Solve the following system of equations using Gaussian elimination:

2x + 3y -  z =  5
4x + 4y - 3z =  3
2x - 3y + 2z =  2

Show all row operations clearly.`,
}

const studentAnswer = `Write the augmented matrix:
[ 2   3  -1  |  5 ]
[ 4   4  -3  |  3 ]
[ 2  -3   2  |  2 ]

R2 -> R2 - 2R1:
[ 2   3  -1  |  5 ]
[ 0  -2  -1  | -7 ]
[ 2  -3   2  |  2 ]

R3 -> R3 - R1:
[ 2   3  -1  |  5 ]
[ 0  -2  -1  | -7 ]
[ 0  -6   3  | -3 ]

R3 -> R3 - 3R2:
[ 2   3  -1  |  5 ]
[ 0  -2  -1  | -7 ]
[ 0   0   6  | 18 ]

Back substitution:
6z = 18  ->  z = 3
-2y - 3 = -7  ->  -2y = -4  ->  y = 2
2x + 6 - 3 = 5  ->  2x = 2  ->  x = 1

Solution: x = 1, y = 2, z = 3`

const rubricCriteria = [
  { id: 1, label: 'Augmented matrix setup', max: 2, earned: 2 },
  { id: 2, label: 'Row operation correctness', max: 3, earned: 3 },
  { id: 3, label: 'Back substitution accuracy', max: 3, earned: 2 },
  { id: 4, label: 'Final answer clarity', max: 2, earned: 2 },
]

export default function Grading() {
  const [score, setScore] = useState(9)
  const [flags, setFlags] = useState<number[]>([])

  function toggleFlag(id: number) {
    setFlags((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      {/* Top bar */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100">ExamMark AI</h1>
            <p className="text-xs text-slate-500">Grading Workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
            Script #1042
          </span>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Processed
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Student script */}
        <div className="xl:col-span-3 space-y-6">
          {/* Student answer panel */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 text-xs font-bold text-slate-300">
                  {question.number}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Student Answer</h2>
                  <p className="text-xs text-slate-500">Question {question.number} &middot; {question.maxMarks} marks</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleFlag(0)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  flags.includes(0)
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:text-slate-300'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 0 1 2-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 0 0-2 2zm9-13.5V9" />
                </svg>
                {flags.includes(0) ? 'Flagged' : 'Flag'}
              </button>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/40">
              <pre className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{studentAnswer}</pre>
            </div>
          </div>

          {/* AI analysis panel */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-slate-100">AI Assessment</h2>
            </div>
            <div className="space-y-3">
              {rubricCriteria.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleFlag(c.id)}
                      className={`shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        flags.includes(c.id)
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800/60 text-slate-600 border border-slate-700/50 hover:text-slate-400'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                    </button>
                    <div>
                      <p className="text-sm text-slate-300">{c.label}</p>
                      <p className="text-xs text-slate-500">{c.earned}/{c.max} &middot; {Math.round((c.earned / c.max) * 100)}% match</p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-medium ${
                    c.earned === c.max ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {c.earned}/{c.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Grading panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Question reference */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-300">Q{question.number}</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-100">Question Reference</h2>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/40">
              <pre className="text-sm text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">{question.text}</pre>
            </div>
          </div>

          {/* Score card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-slate-100">Final Score</h2>
              <div className="text-xs text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-700/50">
                AI suggested: <span className="text-slate-300 font-mono">9/10</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setScore(Math.max(0, score - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </button>
              <div className="text-center">
                <span className="text-6xl font-bold text-slate-100 tabular-nums tracking-tight">{score}</span>
                <span className="text-lg text-slate-500 font-mono">/{question.maxMarks}</span>
              </div>
              <button
                type="button"
                onClick={() => setScore(Math.min(question.maxMarks, score + 1))}
                className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
              </button>
            </div>
            <div className="w-full bg-slate-800/40 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                style={{ width: `${(score / question.maxMarks) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>0</span>
              <span className="text-slate-400">{Math.round((score / question.maxMarks) * 100)}%</span>
              <span>{question.maxMarks}</span>
            </div>

            {/* Touch to Quiz */}
            <button
              type="button"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-semibold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-teal-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Touch to Quiz
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>
              <span className="text-xs text-slate-500">Question 3 of 8</span>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
