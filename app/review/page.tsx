'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, Clock, ChevronRight, Code2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import CodeEditor from '@/components/CodeEditor'
import ResultPanel from '@/components/ResultPanel'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

interface ReviewResult {
  type: 'error' | 'warning' | 'suggestion' | 'info' | 'success'
  title: string
  description: string
  line?: number
  code?: string
}

interface ReviewHistoryItem {
  id: string
  code: string
  language?: string
  results: ReviewResult[]
  createdAt: string
}

// Mock data for demo
const mockResults: ReviewResult[] = [
  {
    type: 'error',
    title: 'Potential null reference',
    description: 'The variable "user" might be null when accessed. Consider adding a null check.',
    line: 5,
    code: 'if (user) { /* safe access */ }',
  },
  {
    type: 'warning',
    title: 'Unused variable',
    description: 'The variable "temp" is declared but never used in this scope.',
    line: 12,
  },
  {
    type: 'suggestion',
    title: 'Use const instead of let',
    description: 'The variable "data" is never reassigned. Consider using const for immutability.',
    line: 3,
    code: 'const data = fetchData();',
  },
  {
    type: 'success',
    title: 'Good error handling',
    description: 'The try-catch block properly handles potential errors in the async operation.',
    line: 15,
  },
]

const mockHistory: ReviewHistoryItem[] = [
  {
    id: '1',
    code: 'function hello() { return "world"; }',
    language: 'javascript',
    results: mockResults.slice(0, 2),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    code: 'const sum = (a, b) => a + b;',
    language: 'typescript',
    results: mockResults.slice(2),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function CodeReviewPage() {
  const [code, setCode] = useState('')
  const [results, setResults] = useState<ReviewResult[] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [history, setHistory] = useState<ReviewHistoryItem[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)

  // Load history on mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await api.get('/review')
      setHistory(response.data.history || mockHistory)
    } catch {
      // Use mock data if API fails
      setHistory(mockHistory)
    }
  }

  const handleAnalyze = async () => {
    if (!code.trim()) return
    
    setIsAnalyzing(true)
    setResults(null)
    
    try {
      const response = await api.post('/review', { code })
      const analysis = response.data.analysis
      
      // Transform API response to ReviewResult format
      const transformedResults: ReviewResult[] = []
      
      // Add issues
      if (Array.isArray(analysis?.issues)) {
        analysis.issues.forEach((issue: { type: string; line?: number; message: string }) => {
          transformedResults.push({
            type: (issue.type === 'info' ? 'suggestion' : issue.type) as ReviewResult['type'],
            title: issue.type.charAt(0).toUpperCase() + issue.type.slice(1),
            description: issue.message,
            line: issue.line,
          })
        })
      }
      
      // Add suggestions
      if (Array.isArray(analysis?.suggestions)) {
        analysis.suggestions.forEach((suggestion: string) => {
          transformedResults.push({
            type: 'suggestion',
            title: 'Suggestion',
            description: suggestion,
          })
        })
      }
      
      setResults(transformedResults.length > 0 ? transformedResults : [{
        type: 'success',
        title: 'No Issues Found',
        description: 'Your code looks good! No issues or warnings detected.',
      }])
      
      // Refresh history after successful analysis
      loadHistory()
    } catch {
      // Use mock results for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResults(mockResults)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleHistoryClick = (item: ReviewHistoryItem) => {
    setCode(item.code)
    setResults(item.results)
    setSelectedHistoryId(item.id)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Code Review</h1>
            <p className="mt-1 text-muted-foreground">
              Paste your code and get instant AI-powered analysis
            </p>
          </div>
          
          {/* Main Content - Split Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left - Code Input */}
            <div className="flex flex-col gap-4">
              <CodeEditor
                value={code}
                onChange={setCode}
                placeholder="Paste your code here for review..."
                minHeight="450px"
              />
              
              <Button
                onClick={handleAnalyze}
                disabled={!code.trim() || isAnalyzing}
                size="lg"
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Analyze Code
                  </>
                )}
              </Button>
            </div>
            
            {/* Right - Results Panel */}
            <ResultPanel
              title="Analysis Results"
              results={results}
              isLoading={isAnalyzing}
            />
          </div>
          
          {/* Review History */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Review History</h2>
            
            {history.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHistoryClick(item)}
                    className={cn(
                      'group rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
                      selectedHistoryId === item.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card'
                    )}
                  >
                    {/* Code Preview */}
                    <div className="mb-3 flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {item.language || 'code'}
                      </span>
                    </div>
                    
                    <pre className="mb-3 overflow-hidden truncate font-mono text-sm text-foreground">
                      {(item.code || '').slice(0, 50)}...
                    </pre>
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(item.createdAt)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                    
                    {/* Issues summary */}
                    <div className="mt-3 flex gap-2">
                      {item.results.filter(r => r.type === 'error').length > 0 && (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">
                          {item.results.filter(r => r.type === 'error').length} errors
                        </span>
                      )}
                      {item.results.filter(r => r.type === 'warning').length > 0 && (
                        <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-500">
                          {item.results.filter(r => r.type === 'warning').length} warnings
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  No review history yet. Start by analyzing some code above.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
