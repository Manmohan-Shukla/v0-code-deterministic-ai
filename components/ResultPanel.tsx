'use client'

import { AlertCircle, CheckCircle2, Info, Lightbulb, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ResultItem {
  type: 'error' | 'warning' | 'suggestion' | 'info' | 'success'
  title: string
  description: string
  line?: number
  code?: string
}

interface ResultPanelProps {
  title: string
  results: ResultItem[] | null
  isLoading?: boolean
  rawOutput?: string
  className?: string
}

export default function ResultPanel({
  title,
  results,
  isLoading = false,
  rawOutput,
  className,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false)

  const getIcon = (type: ResultItem['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-primary" />
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getBgColor = (type: ResultItem['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'suggestion':
        return 'bg-primary/10 border-primary/20'
      case 'success':
        return 'bg-green-500/10 border-green-500/20'
      default:
        return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  const handleCopy = async () => {
    const textToCopy = rawOutput || results?.map(r => `${r.title}: ${r.description}`).join('\n') || ''
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-medium text-foreground">{title}</h3>
        {(results || rawOutput) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>

      {/* Panel Content */}
      <div className="code-scrollbar max-h-[600px] overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Analyzing your code...</p>
          </div>
        ) : rawOutput ? (
          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
            {rawOutput}
          </pre>
        ) : results && results.length > 0 ? (
          <div className="flex flex-col gap-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg border p-4 transition-colors',
                  getBgColor(result.type)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(result.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{result.title}</h4>
                      {result.line && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          Line {result.line}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.description}
                    </p>
                    {result.code && (
                      <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-2 font-mono text-xs text-foreground">
                        {result.code}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No results yet. Submit your code to see the analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
