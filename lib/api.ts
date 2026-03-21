import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI operations
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// API endpoints for code analysis features
export const codeApi = {
  // Code Review
  analyzeCode: (code: string, language?: string) => 
    api.post('/code/review', { code, language }),
  
  getReviewHistory: () => 
    api.get('/code/reviews'),
  
  getReviewById: (id: string) => 
    api.get(`/code/reviews/${id}`),

  // Code Optimization
  optimizeCode: (code: string, language?: string) => 
    api.post('/code/optimize', { code, language }),

  // Test Case Generation
  generateTests: (code: string, language?: string, framework?: string) => 
    api.post('/code/generate-tests', { code, language, framework }),

  // Complexity Analysis
  analyzeComplexity: (code: string, language?: string) => 
    api.post('/code/complexity', { code, language }),
}

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  signup: (name: string, email: string, password: string) => 
    api.post('/auth/signup', { name, email, password }),
  
  getProfile: () => 
    api.get('/auth/profile'),
}
