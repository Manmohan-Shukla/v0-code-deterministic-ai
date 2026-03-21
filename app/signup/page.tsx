'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Code2, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')
  const { signup, error, clearError } = useAuth()

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()
    
    // Validation
    if (!name || !email || !password) {
      setLocalError('Please fill in all fields')
      return
    }
    
    if (name.length < 2) {
      setLocalError('Name must be at least 2 characters')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Please enter a valid email address')
      return
    }
    
    if (!passwordChecks.length) {
      setLocalError('Password must be at least 8 characters')
      return
    }
    
    setIsSubmitting(true)
    try {
      await signup(name, email, password)
    } catch {
      // Error is handled by context
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayError = localError || error

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Code Deterministic AI</span>
            </Link>
          </div>
          
          {/* Signup Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Start analyzing your code with AI
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {displayError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {displayError}
                </div>
              )}
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicators */}
                {password && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      Lowercase
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      Number
                    </div>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
          
          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
