import { NextRequest, NextResponse } from 'next/server'

// Mock optimization function
function optimizeCode(code: string): string {
  let optimized = code

  // Replace var with const/let
  optimized = optimized.replace(/\bvar\s+(\w+)\s*=/g, 'const $1 =')
  
  // Replace function declarations with arrow functions (simplified)
  optimized = optimized.replace(
    /function\s+(\w+)\s*\(([^)]*)\)\s*{/g,
    'const $1 = ($2) => {'
  )

  // Add semicolons where missing (very simplified)
  const lines = optimized.split('\n')
  optimized = lines.map(line => {
    const trimmed = line.trim()
    if (trimmed && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') && 
        !trimmed.endsWith(';') && 
        !trimmed.endsWith(',') &&
        !trimmed.startsWith('//') &&
        !trimmed.startsWith('/*') &&
        !trimmed.startsWith('*') &&
        (trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('return '))) {
      return line.replace(/\s*$/, ';')
    }
    return line
  }).join('\n')

  return optimized
}

// Mock test case generation
function generateTestCases(code: string): string {
  // Extract function names
  const functionMatches = code.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])*=>)/g) || []
  const functionNames = functionMatches.map(m => {
    const match = m.match(/(?:function\s+|const\s+)(\w+)/)
    return match ? match[1] : 'unknownFunction'
  })

  if (functionNames.length === 0) {
    return `// No functions detected in the code
// Example test structure:

import { describe, it, expect } from 'vitest'

describe('YourModule', () => {
  it('should work correctly', () => {
    // Add your test here
    expect(true).toBe(true)
  })
})`
  }

  const tests = functionNames.map(name => `
  describe('${name}', () => {
    it('should return expected result with valid input', () => {
      // Arrange
      const input = /* your test input */;
      const expected = /* expected output */;
      
      // Act
      const result = ${name}(input);
      
      // Assert
      expect(result).toEqual(expected);
    })

    it('should handle edge cases', () => {
      // Test with empty input
      expect(() => ${name}(null)).not.toThrow();
    })

    it('should handle invalid input gracefully', () => {
      // Test error handling
      expect(() => ${name}(undefined)).toThrow();
    })
  })`).join('\n')

  return `import { describe, it, expect } from 'vitest'
import { ${functionNames.join(', ')} } from './yourModule'
${tests}`
}

// Mock complexity analysis
function analyzeComplexity(code: string): { time: string; space: string; explanation: string } {
  const hasLoop = /\b(for|while|forEach|map|filter|reduce)\b/.test(code)
  const hasNestedLoop = /\b(for|while)\b[\s\S]*\b(for|while)\b/.test(code)
  const hasRecursion = /function\s+(\w+)[^{]*{[\s\S]*\1\s*\(/.test(code)
  const hasArray = /\[\s*\]|new\s+Array|\.push|\.pop/.test(code)
  const hasObject = /{\s*}|new\s+Object/.test(code)

  let time = 'O(1)'
  let space = 'O(1)'
  let explanation = ''

  if (hasNestedLoop) {
    time = 'O(n²)'
    explanation = 'Nested loops detected. The algorithm iterates through the input multiple times in a nested fashion, resulting in quadratic time complexity.'
  } else if (hasLoop) {
    time = 'O(n)'
    explanation = 'Single loop detected. The algorithm iterates through the input once, resulting in linear time complexity.'
  } else if (hasRecursion) {
    time = 'O(n) or O(2^n)'
    explanation = 'Recursion detected. Time complexity depends on the recursion pattern. Simple recursion is O(n), but branching recursion (like Fibonacci) can be O(2^n).'
  } else {
    explanation = 'No loops or recursion detected. The algorithm performs a constant number of operations regardless of input size.'
  }

  if (hasArray && hasLoop) {
    space = 'O(n)'
    explanation += ' Arrays are created proportional to input size.'
  } else if (hasArray || hasObject) {
    space = 'O(n)'
    explanation += ' Data structures are used that may grow with input.'
  } else if (hasRecursion) {
    space = 'O(n)'
    explanation += ' Recursive calls consume stack space proportional to recursion depth.'
  }

  return { time, space, explanation }
}

export async function POST(request: NextRequest) {
  try {
    const { code, type } = await request.json()

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        { message: 'Code is required' },
        { status: 400 }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    let result: unknown

    switch (type) {
      case 'optimize':
        result = {
          optimizedCode: optimizeCode(code),
          changes: [
            'Replaced var with const/let',
            'Converted function declarations to arrow functions',
            'Added missing semicolons'
          ]
        }
        break

      case 'tests':
        result = {
          testCode: generateTestCases(code),
          framework: 'Vitest',
          testCount: 3
        }
        break

      case 'complexity':
        result = analyzeComplexity(code)
        break

      default:
        return NextResponse.json(
          { message: 'Invalid suggestion type. Use: optimize, tests, or complexity' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      type,
      result,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Suggest error:', error)
    return NextResponse.json(
      { message: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
