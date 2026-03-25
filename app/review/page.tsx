'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import CodeEditor from '@/components/CodeEditor'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface ReviewResult {
  type: 'error' | 'warning' | 'suggestion' | 'info' | 'success'
  title: string
  raw?: any
  description?: string
}

// ✅ Format label
function formatLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// ✅ Color logic (IMPORTANT)
function getValueColor(value: any) {
  if (value === true) return 'text-green-500'
  if (value === false) return 'text-red-500'
  return 'text-zinc-900 dark:text-zinc-100'
}

// ✅ Clean AI text
function cleanAIText(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/^\s*[-–•]\s+/gm, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
}

// ✅ Parse AI sections
function parseAISections(text: string) {
  const clean = cleanAIText(text)
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean)

  const sections: { title: string; content: string[] }[] = []
  let current = { title: '', content: [] as string[] }

  for (let line of lines) {
    if (
      line.toLowerCase().includes('error') ||
      line.toLowerCase().includes('complexity') ||
      line.toLowerCase().includes('fix')
    ) {
      if (current.title) sections.push(current)
      current = { title: line.replace(':', ''), content: [] }
    } else {
      current.content.push(line)
    }
  }

  if (current.title) sections.push(current)
  return sections
}

export default function CodeReviewPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [constraints, setConstraints] = useState('')
  const [results, setResults] = useState<ReviewResult[] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)
    setResults(null)

    try {
      const res = await api.post('/api/review/analyze', {
        code,
        language,
        constraints
      })

      const { static_info, failure_info, response } = res.data

      const formatted: ReviewResult[] = []

      if (static_info) {
        formatted.push({
          type: 'info',
          title: '🔍 Static Analysis',
          raw: static_info
        })
      }

      if (failure_info) {
        formatted.push({
          type: 'warning',
          title: '⚠️ Failure Analysis',
          raw: failure_info
        })
      }

      if (response) {
        formatted.push({
          type: 'success',
          title: '🤖 AI Review',
          description: response
        })
      }

      setResults(formatted)

    } catch (err) {
      console.error(err)
      setResults([
        {
          type: 'error',
          title: '❌ Error',
          description: 'Failed to analyze code'
        }
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8">

          <h1 className="text-2xl font-bold mb-6">Code Review</h1>

          {/* Controls */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Constraints</label>
              <input
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="optimize for time..."
                className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="flex flex-col gap-4">
              <CodeEditor value={code} onChange={setCode} />

              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2" />
                    Analyze Code
                  </>
                )}
              </Button>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">

              {results?.map((res, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 shadow-sm
                             bg-zinc-50 dark:bg-zinc-900
                             border-zinc-200 dark:border-zinc-700"
                >
                  <h3 className="font-semibold mb-3 text-lg">
                    {res.title}
                  </h3>

                  {/* 🔍 STATIC */}
                  {res.title.includes('Static') && res.raw && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(res.raw).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between px-3 py-2 rounded-md
                                     bg-white dark:bg-zinc-800
                                     border border-zinc-200 dark:border-zinc-700"
                        >
                          <span className="text-xs opacity-70">
                            {formatLabel(key)}
                          </span>

                          <span className={`font-semibold text-xs ${getValueColor(value)}`}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ⚠️ FAILURE (SMART) */}
                  {res.title.includes('Failure') && res.raw && (
                    <div className="space-y-3">

                      {/* top grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(res.raw)
                          .filter(([key]) => key !== 'reason')
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between px-3 py-2 rounded-md
                                         bg-white dark:bg-zinc-800
                                         border border-zinc-200 dark:border-zinc-700"
                            >
                              <span className="text-xs opacity-70">
                                {formatLabel(key)}
                              </span>

                              <span className={`font-semibold text-xs ${getValueColor(value)}`}>
                                {String(value)}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* reason full width */}
                      {res.raw.reason && (
                        <div className="p-3 rounded-md
                                        bg-white dark:bg-zinc-800
                                        border border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs opacity-60 mb-1">Reason</p>
                          <p className="text-sm leading-relaxed">
                            {res.raw.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🤖 AI */}
                  {!res.raw && (
                    <div className="space-y-4 text-sm leading-relaxed">
                      {parseAISections(res.description || '').map((section, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2 opacity-80">
                            {section.title}
                          </h4>

                          <ul className="space-y-1">
                            {section.content.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}

            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}