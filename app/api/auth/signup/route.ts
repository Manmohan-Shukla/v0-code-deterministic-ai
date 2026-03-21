import { NextRequest, NextResponse } from 'next/server'

// In-memory user store (for demo purposes - use a real database in production)
// This simulates your Node.js + Express backend
const users: Map<string, { id: string; name: string; email: string; password: string }> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const userId = `user_${Date.now()}`
    const user = { id: userId, name, email, password }
    users.set(email, user)

    // Generate mock JWT token
    const token = Buffer.from(JSON.stringify({ 
      userId, 
      email, 
      exp: Date.now() + 24 * 60 * 60 * 1000 
    })).toString('base64')

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: { id: userId, name, email }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
