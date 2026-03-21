'use client'

import Link from 'next/link'
import { 
  Code2, 
  Search, 
  Zap, 
  TestTube2, 
  Timer, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Search,
    title: 'Code Review',
    description: 'Detect bugs, security vulnerabilities, and code smells with AI-powered analysis.',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Code Optimization',
    description: 'Get intelligent suggestions to improve performance and readability.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: TestTube2,
    title: 'Test Generation',
    description: 'Automatically generate comprehensive test cases for your code.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Timer,
    title: 'Complexity Analysis',
    description: 'Understand time and space complexity of your algorithms instantly.',
    color: 'from-blue-500 to-cyan-500',
  },
]

const benefits = [
  'Instant AI-powered code analysis',
  'Support for multiple programming languages',
  'Detailed explanations and suggestions',
  'Review history tracking',
  'Clean, intuitive interface',
  'Secure and private',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Code Analysis
            </div>
            
            {/* Main Heading */}
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              AI-Powered Code Review, Optimization, Test Cases & 
              <span className="gradient-text"> Complexity Analysis</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Elevate your code quality with intelligent analysis. Get instant feedback, 
              find bugs, optimize performance, and generate tests automatically.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2 px-8">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 px-8">
                <Link href="/signup">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Code Preview Mock */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="gradient-border rounded-xl bg-card p-1">
              <div className="rounded-lg bg-card">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    code-analysis.ts
                  </span>
                </div>
                
                {/* Code Content */}
                <div className="overflow-hidden p-4">
                  <pre className="font-mono text-sm">
                    <code>
                      <span className="text-muted-foreground">{'// Analyzing your code...'}</span>
                      {'\n\n'}
                      <span className="text-primary">function</span>{' '}
                      <span className="text-yellow-500">analyzeCode</span>
                      {'(code: '}
                      <span className="text-cyan-500">string</span>
                      {') {\n  '}
                      <span className="text-primary">const</span>
                      {' analysis = '}
                      <span className="text-primary">await</span>
                      {' ai.'}
                      <span className="text-yellow-500">review</span>
                      {'(code);\n  '}
                      <span className="text-primary">return</span>
                      {' {\n    bugs: analysis.bugs,\n    suggestions: analysis.suggestions,\n    complexity: analysis.'}
                      <span className="text-green-500">timeComplexity</span>
                      {',\n  };\n}'}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Floating analysis cards */}
            <div className="absolute -right-4 -top-4 hidden rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 backdrop-blur-sm lg:block">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                No bugs detected
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 backdrop-blur-sm lg:block">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Timer className="h-4 w-4" />
                O(n) time complexity
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful Features for Modern Developers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Everything you need to write better code, faster.
            </p>
          </div>
          
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Icon */}
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                
                {/* Hover effect */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose Code Deterministic AI?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Built by developers, for developers. Our platform combines cutting-edge 
                AI with a deep understanding of code quality best practices.
              </p>
              
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/signup">
                    Start Analyzing Code
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Stats/Visual */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="text-4xl font-bold text-primary">99%</div>
                <div className="mt-2 text-sm text-muted-foreground">Bug Detection Rate</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="text-4xl font-bold text-primary">{'<1s'}</div>
                <div className="mt-2 text-sm text-muted-foreground">Analysis Time</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="text-4xl font-bold text-primary">50+</div>
                <div className="mt-2 text-sm text-muted-foreground">Languages Supported</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="text-4xl font-bold text-primary">10K+</div>
                <div className="mt-2 text-sm text-muted-foreground">Active Developers</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Code2 className="h-4 w-4" />
            Ready to elevate your code?
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Start analyzing your code today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of developers who trust Code Deterministic AI to improve 
            their code quality and productivity.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-8">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Code Deterministic AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with intelligence. Designed for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
