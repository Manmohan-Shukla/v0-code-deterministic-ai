'use client'

import Link from 'next/link'
import { Search, Lightbulb, ArrowRight, Activity, History, Code2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'

const actionCards = [
  {
    href: '/review',
    icon: Search,
    title: 'Code Review',
    description: 'Analyze your code for bugs, security issues, and code smells. Get detailed feedback and improvement suggestions.',
    gradient: 'from-red-500 to-orange-500',
    bgGlow: 'bg-red-500/10',
  },
  {
    href: '/suggest',
    icon: Lightbulb,
    title: 'AI Suggestions',
    description: 'Optimize your code, generate test cases, and analyze time/space complexity with AI assistance.',
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'bg-violet-500/10',
  },
]

const quickStats = [
  { label: 'Reviews Today', value: '12', icon: Activity },
  { label: 'Total Reviews', value: '248', icon: History },
  { label: 'Lines Analyzed', value: '15.2K', icon: Code2 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.name || 'Developer'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              What would you like to analyze today?
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Action Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {actionCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Background Glow */}
                <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${card.bgGlow} blur-3xl opacity-0 transition-opacity group-hover:opacity-100`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${card.gradient} p-4`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h2 className="text-2xl font-bold text-foreground">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    {card.description}
                  </p>
                  
                  {/* Action */}
                  <div className="mt-6 flex items-center gap-2 text-primary">
                    <span className="font-medium">Get Started</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Recent Activity Placeholder */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Activity</h2>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">No recent activity</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start analyzing code to see your review history here.
              </p>
              <Link
                href="/review"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Start your first review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
