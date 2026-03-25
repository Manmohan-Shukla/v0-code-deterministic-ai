'use client'

import { useState } from 'react'
import { Zap, TestTube2, Timer, Loader2, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import CodeEditor from '@/components/CodeEditor'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

type SuggestionTab = 'optimize' | 'tests' | 'complexity'

const tabs = [
  { id: 'optimize', label: 'Optimize Code', icon: Zap },
  { id: 'tests', label: 'Generate Tests', icon: TestTube2 },
  { id: 'complexity', label: 'Analyze Complexity', icon: Timer },
]

// ✅ Correct route mapping
const endpointMap = {
  optimize: '/api/suggest/optimize',
  tests: '/api/suggest/testcase',
  complexity: '/api/suggest/timecomplexity',
}

export default function CodeSuggestPage() {
  const [activeTab, setActiveTab] = useState<SuggestionTab>('optimize')

  const [code, setCode] = useState('')
  const [problem, setProblem] = useState('')
  const [constraints, setConstraints] = useState('')

  const [output, setOutput] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!code.trim()) {
      alert("Code is required")
      return
    }

    if (activeTab === 'tests' && !problem.trim()) {
      alert("Problem description is required")
      return
    }

    setIsGenerating(true)
    setOutput(null)

    try {
      const endpoint = endpointMap[activeTab]

      // ✅ FINAL FIXED PAYLOAD
      const payload: any = {
        code: code.trim(),
      }

      if (activeTab === 'tests') {
        payload.problem = problem.trim()

        // 🔥 FIX: constraints must be object
        payload.constraints = constraints
          ? { raw: constraints.trim() }
          : {}
      }

      console.log("FINAL PAYLOAD:", payload)

      const response = await api.post(endpoint, payload)
      const result = response.data

      let formattedOutput = ''

      // 🚀 OPTIMIZE
      if (activeTab === 'optimize') {
        formattedOutput = `
🚀 Optimizations

${
  Array.isArray(result?.optimization)
    ? result.optimization.map((o: string) => `• ${o}`).join('\n')
    : 'No suggestions'
}
        `
      }

      // 🧪 TESTCASES
      if (activeTab === 'tests') {
        formattedOutput = `
🧪 Test Cases

${
  Array.isArray(result?.testcases)
    ? result.testcases.map((t: any, i: number) =>
        `Test ${i + 1}: ${JSON.stringify(t)}`
      ).join('\n')
    : 'No test cases generated'
}
        `
      }

      // 📊 COMPLEXITY
      if (activeTab === 'complexity') {
        formattedOutput = `
📊 Complexity Analysis

${JSON.stringify(result?.complexity, null, 2)}

📘 Explanation:
${result?.explanation || 'No explanation'}
        `
      }

      setOutput(formattedOutput.trim())

    } catch (err: any) {
      console.error("FULL ERROR:", err)

      console.log("BACKEND ERROR:", err?.response?.data)

      setOutput(
        err?.response?.data?.error ||
        '❌ Failed to generate result'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon!

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8">

          {/* HEADER */}
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">AI Suggestions</h1>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setOutput(null)
                }}
                className={cn(
                  'px-4 py-2 rounded-lg border flex items-center gap-2',
                  activeTab === tab.id
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-zinc-300 dark:border-zinc-700'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-2 gap-3 mb-4">

            <input
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. n ≤ 1e5"
              className="p-2 border rounded-md bg-white dark:bg-zinc-900"
            />

          </div>

          {/* 🔥 TESTCASE ONLY */}
          {activeTab === 'tests' && (
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter problem description..."
              className="w-full p-2 border rounded-md bg-white dark:bg-zinc-900 mb-4"
            />
          )}

          {/* LAYOUT */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="flex flex-col gap-4">
              <CodeEditor value={code} onChange={setCode} />

              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ActiveIcon className="mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {/* RIGHT */}
            <div className="p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-900 whitespace-pre-wrap text-sm">
              {isGenerating && "⏳ Generating..."}
              {!isGenerating && output}
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}