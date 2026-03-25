import axios from 'axios'

/**
 * API Configuration
 *
 * Environment Variables:
 * - NEXT_PUBLIC_API_URL: Backend API base URL
 *   Examples:
 *   - Local mock: /api
 *   - Local backend: http://localhost:5000/api
 *   - Production: https://code-determinsitic-ai.onrender.com/api
 *
 * - NEXT_PUBLIC_API_TIMEOUT: Request timeout in ms (default: 30000)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10)

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
})

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 (logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
if (!window.location.pathname.includes('/login')) {
  window.location.href = '/login'
}
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ==================== TYPE DEFINITIONS ====================

export interface AnalyzeCodePayload {
  language: string
  code: string
  constraints?: string
}

export interface SuggestPayload {
  code: string
  problem?: string
  constraints?: Record<string, any>
  metadata?: any
  language?: string
}

// ==================== CODE REVIEW API ====================

export const codeApi = {
  // Matches your analyzecode controller
  analyzeCode: (payload: AnalyzeCodePayload) =>
    api.post('/api/review/analyze', payload),

  // Matches your getHistory controller
  getReviewHistory: () =>
    api.get('/api/review/history'),

  // Matches your getId controller
  getReviewById: (id: string) =>
    api.get(`/api/review/${id}`),
}

// ==================== CODE SUGGEST / AI FEATURES API ====================

export const suggestApi = {
  // Matches your testcase controller
  generateTests: (payload: SuggestPayload) =>
    api.post('/api/suggest/testcase', payload),

  // Matches your timecomplexity controller
  analyzeComplexity: (payload: { code: string }) =>
    api.post('/api/suggest/timecomplexity', payload),

  // Matches your optimize controller
  optimizeCode: (payload: SuggestPayload) =>
    api.post('/api/suggest/optimize', payload),
}

// ==================== AUTH API ====================

export const authApi = {
  // Matches your login controller
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  // Matches your signup controller (uses username, not name)
  signup: (username: string, email: string, password: string) =>
    api.post('/api/auth/signup', { username, email, password }),

  // Matches your getMe controller
  getProfile: () =>
    api.get('/api/auth/me'),
}