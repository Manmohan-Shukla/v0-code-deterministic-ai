'use client'

import { useState } from 'react'
import { Zap, TestTube2, Timer, Loader2, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import CodeEditor from '@/components/CodeEditor'
import ResultPanel from '@/components/ResultPanel'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

type SuggestionTab = 'optimize' | 'tests' | 'complexity'

const tabs = [
  {
    id: 'optimize' as const,
    label: 'Optimize Code',
    icon: Zap,
    description: 'Get AI-powered suggestions to improve performance and readability',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'tests' as const,
    label: 'Generate Tests',
    icon: TestTube2,
    description: 'Automatically generate comprehensive test cases',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'complexity' as const,
    label: 'Analyze Complexity',
    icon: Timer,
    description: 'Understand time and space complexity of your code',
    color: 'from-blue-500 to-cyan-500',
  },
]

// Mock responses for demo
const mockResponses = {
  optimize: `// Optimized Code
function findDuplicates(arr) {
  // Using Set for O(n) time complexity instead of nested loops
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return [...duplicates];
}

/* Optimizations made:
 * 1. Replaced O(n²) nested loop with O(n) Set-based approach
 * 2. Used Set for constant-time lookups
 * 3. Avoided creating intermediate arrays
 */`,
  tests: `// Generated Test Cases
import { describe, it, expect } from 'vitest';

describe('findDuplicates', () => {
  it('should return empty array for empty input', () => {
    expect(findDuplicates([])).toEqual([]);
  });

  it('should return empty array when no duplicates exist', () => {
    expect(findDuplicates([1, 2, 3, 4, 5])).toEqual([]);
  });

  it('should find single duplicate', () => {
    expect(findDuplicates([1, 2, 2, 3])).toContain(2);
  });

  it('should find multiple duplicates', () => {
    const result = findDuplicates([1, 2, 2, 3, 3, 4]);
    expect(result).toContain(2);
    expect(result).toContain(3);
  });

  it('should handle all same elements', () => {
    expect(findDuplicates([5, 5, 5, 5])).toEqual([5]);
  });

  it('should handle string duplicates', () => {
    expect(findDuplicates(['a', 'b', 'a'])).toContain('a');
  });
});`,
  complexity: `# Complexity Analysis Report

## Time Complexity: O(n²)

### Breakdown:
- Outer loop: O(n) - iterates through each element
- Inner loop: O(n) - searches for duplicates
- Total: O(n × n) = O(n²)

## Space Complexity: O(n)

### Breakdown:
- Result array: O(k) where k is number of duplicates
- Worst case: k = n, so O(n)

## Recommendations:

1. **Use a Hash Set** - Reduce time complexity to O(n)
   - Store seen elements in a Set
   - Check for existence in O(1) time

2. **Sort first** - Alternative O(n log n) approach
   - Sort array first
   - Compare adjacent elements

## Performance Impact:
| Input Size | Current Time | Optimized Time |
|------------|--------------|----------------|
| 100        | 10,000 ops   | 100 ops        |
| 1,000      | 1M ops       | 1,000 ops      |
| 10,000     | 100M ops     | 10,000 ops     |

The current implementation will become noticeably slow with inputs larger than 1,000 elements.`,
}

export default function CodeSuggestPage() {
  const [activeTab, setActiveTab] = useState<SuggestionTab>('optimize')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!code.trim()) return
    
    setIsGenerating(true)
    setOutput(null)
    
    try {
      const response = await api.post('/suggest', { code, type: activeTab })
      const result = response.data.result
      
      // Format output based on type
      let formattedOutput: string
      if (activeTab === 'optimize') {
        formattedOutput = `// Optimized Code\n${result.optimizedCode}\n\n/* Changes made:\n${result.changes.map((c: string) => ` * ${c}`).join('\n')}\n */`
      } else if (activeTab === 'tests') {
        formattedOutput = result.testCode
      } else {
        formattedOutput = `# Complexity Analysis Report\n\n## Time Complexity: ${result.time}\n\n## Space Complexity: ${result.space}\n\n## Explanation:\n${result.explanation}`
      }
      
      setOutput(formattedOutput)
    } catch {
      // Use mock response for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOutput(mockResponses[activeTab])
    } finally {
      setIsGenerating(false)
    }
  }

  const activeTabInfo = tabs.find(t => t.id === activeTab)!

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">AI Suggestions</h1>
            </div>
            <p className="mt-1 text-muted-foreground">
              Get intelligent code improvements, test generation, and complexity analysis
            </p>
          </div>
          
          {/* Tab Selector */}
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setOutput(null)
                }}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                  tab.color
                )}>
                  <tab.icon className="h-4 w-4 text-white" />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Active Tab Description */}
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br',
                activeTabInfo.color
              )}>
                <activeTabInfo.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{activeTabInfo.label}</h2>
                <p className="text-sm text-muted-foreground">{activeTabInfo.description}</p>
              </div>
            </div>
          </div>
          
          {/* Main Content - Split Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left - Code Input */}
            <div className="flex flex-col gap-4">
              <CodeEditor
                value={code}
                onChange={setCode}
                placeholder={`Paste your code here for ${activeTabInfo.label.toLowerCase()}...`}
                minHeight="400px"
              />
              
              <Button
                onClick={handleGenerate}
                disabled={!code.trim() || isGenerating}
                size="lg"
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <activeTabInfo.icon className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            
            {/* Right - Results Panel */}
            <ResultPanel
              title={`${activeTabInfo.label} Results`}
              results={null}
              rawOutput={output || undefined}
              isLoading={isGenerating}
            />
          </div>
          
          {/* Tips Section */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Tips for Best Results</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <h4 className="font-medium text-foreground">Optimization</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Include complete functions for better optimization suggestions.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <TestTube2 className="h-5 w-5 text-green-500" />
                </div>
                <h4 className="font-medium text-foreground">Test Generation</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Provide clear function signatures for comprehensive test coverage.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Timer className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-medium text-foreground">Complexity</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Include loops and recursive calls for accurate complexity analysis.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
