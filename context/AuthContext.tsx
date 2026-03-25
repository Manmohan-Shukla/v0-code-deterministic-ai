'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import api from '@/lib/api'

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  // ✅ 1. Load from localStorage safely
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.log("Invalid stored user → clearing")
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  // ✅ 2. Verify token with backend
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) return

      try {
        const res = await api.get('/api/auth/me')
        setUser(res.data.user)
      } catch (err) {
        console.log("Token invalid → clearing")

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setToken(null)
        setUser(null)
      }
    }

    verifyUser()
  }, [token])

  // ✅ 3. Route protection (NO LOOP)
  useEffect(() => {
    if (isLoading) return

    const publicPages = ['/login', '/signup']
    const isPublicPage = publicPages.includes(pathname)

    if (!token && !isPublicPage) {
      router.replace('/login')
      return
    }

    if (token && isPublicPage) {
      router.replace('/dashboard')
      return
    }
  }, [token, isLoading, pathname, router])

  // ✅ 4. Login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.post('/api/auth/login', { email, password })

      const { token: newToken, user: userData } = res.data

      if (!newToken || !userData) {
        throw new Error("Invalid response from server")
      }

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(newToken)
      setUser(userData)

      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed"
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ 5. Signup
  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.post('/api/auth/signup', { username, email, password })

      const { token: newToken, user: userData } = res.data

      if (!newToken || !userData) {
        throw new Error("Invalid response from server")
      }

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(newToken)
      setUser(userData)

      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || "Signup failed"
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ 6. Logout (safe)
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)

    router.replace('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}