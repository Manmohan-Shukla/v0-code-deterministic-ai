import { NextRequest, NextResponse } from 'next/server'

// Demo users for testing (password: "password123")
const demoUsers = new Map([
  ['demo@example.com', { 
    id: 'demo_user_1', 
    name: 'Demo User', 
    email: 'demo@example.com', 
    password: 'password123' 
  }],
  ['test@example.com', { 
    id: 'demo_user_2', 
    name: 'Test User', 
    email: 'test@example.com', 
    password: 'password123' 
  }]
])

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check demo users
    const user = demoUsers.get(email)
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate mock JWT token
    const token = Buffer.from(JSON.stringify({ 
      userId: user.id, 
      email: user.email, 
      exp: Date.now() + 24 * 60 * 60 * 1000 
    })).toString('base64')

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
