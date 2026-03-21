import { NextRequest, NextResponse } from 'next/server'

// Mock AI code review function
function analyzeCode(code: string) {
  const issues: Array<{ type: 'error' | 'warning' | 'info'; line?: number; message: string }> = []
  const lines = code.split('\n')

  // Check for common issues
  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Check for console.log statements
    if (line.includes('console.log')) {
      issues.push({
        type: 'warning',
        line: lineNum,
        message: 'Remove console.log statement before production'
      })
    }

    // Check for var usage
    if (/\bvar\s+/.test(line)) {
      issues.push({
        type: 'warning',
        line: lineNum,
        message: 'Consider using "let" or "const" instead of "var"'
      })
    }

    // Check for == instead of ===
    if (/[^=!]==[^=]/.test(line)) {
      issues.push({
        type: 'error',
        line: lineNum,
        message: 'Use strict equality (===) instead of loose equality (==)'
      })
    }

    // Check for missing semicolons (simplified check)
    if (line.trim() && !line.trim().endsWith('{') && !line.trim().endsWith('}') && 
        !line.trim().endsWith(';') && !line.trim().endsWith(',') && 
        !line.trim().startsWith('//') && !line.trim().startsWith('*') &&
        !line.trim().startsWith('import') && !line.trim().startsWith('export') &&
        (line.includes('const ') || line.includes('let ') || line.includes('return '))) {
      // This is a simplified check - real linters are more sophisticated
    }

    // Check for TODO comments
    if (line.toUpperCase().includes('TODO')) {
      issues.push({
        type: 'info',
        line: lineNum,
        message: 'TODO comment found - remember to address this'
      })
    }

    // Check for empty catch blocks
    if (line.includes('catch') && lines[index + 1]?.trim() === '}') {
      issues.push({
        type: 'error',
        line: lineNum,
        message: 'Empty catch block - handle errors appropriately'
      })
    }
  })

  // General suggestions based on code patterns
  const suggestions: string[] = []

  if (code.includes('function') && !code.includes('=>')) {
    suggestions.push('Consider using arrow functions for cleaner syntax')
  }

  if (code.includes('new Promise')) {
    suggestions.push('Consider using async/await for better readability')
  }

  if (code.length > 500 && !code.includes('/**')) {
    suggestions.push('Add JSDoc comments for better documentation')
  }

  if (!code.includes('try') && (code.includes('fetch') || code.includes('async'))) {
    suggestions.push('Add error handling with try/catch for async operations')
  }

  return {
    issues,
    suggestions,
    summary: {
      errors: issues.filter(i => i.type === 'error').length,
      warnings: issues.filter(i => i.type === 'warning').length,
      info: issues.filter(i => i.type === 'info').length
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        { message: 'Code is required for analysis' },
        { status: 400 }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const analysis = analyzeCode(code)

    return NextResponse.json({
      success: true,
      analysis,
      reviewedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json(
      { message: 'Failed to analyze code' },
      { status: 500 }
    )
  }
}

// Get review history (mock)
export async function GET() {
  const mockHistory = [
    {
      id: '1',
      codeSnippet: 'function add(a, b) { return a + b; }',
      reviewedAt: new Date(Date.now() - 86400000).toISOString(),
      issues: 1
    },
    {
      id: '2', 
      codeSnippet: 'const fetchData = async () => { ... }',
      reviewedAt: new Date(Date.now() - 172800000).toISOString(),
      issues: 2
    }
  ]

  return NextResponse.json({ history: mockHistory })
}
