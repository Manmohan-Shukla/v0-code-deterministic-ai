'use client'

import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
  minHeight?: string
}

export default function CodeEditor({
  value,
  onChange,
  placeholder = 'Paste your code here...',
  className,
  readOnly = false,
  minHeight = '400px',
}: CodeEditorProps) {

  const lines = (value || '').split('\n')

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">
          {readOnly ? 'Output' : 'Code Input'}
        </span>
      </div>

      {/* Editor */}
      <div
        className="flex overflow-auto code-scrollbar"
        style={{ minHeight }}
      >
        {/* Line Numbers */}
        <div className="flex-shrink-0 w-12 border-r border-border bg-muted/30 px-2 py-4 text-right font-mono text-xs text-muted-foreground">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
          {!value && <div className="leading-6">1</div>}
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            'flex-1 resize-none bg-transparent py-4 px-4 font-mono text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none',
            readOnly && 'cursor-default'
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}