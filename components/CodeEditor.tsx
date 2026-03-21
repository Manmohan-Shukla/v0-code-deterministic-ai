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
  return (
    <div className={cn('relative rounded-lg border border-border bg-card', className)}>
      {/* Editor Header */}
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
      
      {/* Editor Content */}
      <div className="relative">
        {/* Line Numbers */}
        <div 
          className="pointer-events-none absolute left-0 top-0 w-12 select-none border-r border-border bg-muted/30 px-2 py-4 text-right font-mono text-xs text-muted-foreground"
          style={{ minHeight }}
        >
          {value.split('\n').map((_, i) => (
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
          className={cn(
            'code-scrollbar w-full resize-none bg-transparent py-4 pl-16 pr-4 font-mono text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none',
            readOnly && 'cursor-default'
          )}
          style={{ minHeight }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
