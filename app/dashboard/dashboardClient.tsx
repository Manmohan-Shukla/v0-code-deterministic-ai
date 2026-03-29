'use client';

import Link from 'next/link';
import { Search, Lightbulb, ArrowRight, Activity, History, Code2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

const actionCards = [
  {
    href: '/review',
    icon: Search,
    title: 'Code Review',
    description: 'Analyze your code for bugs, security issues, and code smells.',
    gradient: 'from-red-500 to-orange-500',
    bgGlow: 'bg-red-500/10',
  },
  {
    href: '/suggest',
    icon: Lightbulb,
    title: 'AI Suggestions',
    description: 'Optimize code, generate tests, and analyze complexity.',
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'bg-violet-500/10',
  },
];

type Review = {
  _id: string;
  language?: string;
  createdAt: string;
  response?: any;
  static_info?: any;
  failure_info?: any;
  constraints?: string;
  model?: string;
};

export default function DashboardClient({ initialData }: { initialData: { reviews: Review[] } }) {
  const { user } = useAuth();
  
  const [recentActivity, setRecentActivity] = useState<Review[]>(initialData.reviews || []);
  const [stats, setStats] = useState({
    reviewsToday: 0,
    totalReviews: 0,
    linesAnalyzed: '0',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate Stats
  useEffect(() => {
    const reviews = initialData.reviews || [];
    const total = reviews.length;

    const today = new Date().toISOString().split('T')[0];
    const reviewsToday = reviews.filter((r) =>
      r.createdAt?.startsWith(today)
    ).length;

    // Estimate lines analyzed (you can improve this later)
    const totalLines = reviews.reduce((sum, r) => {
      const lines = r.static_info?.lines || r.response?.linesAnalyzed || 0;
      return sum + lines;
    }, 0);

    setStats({
      reviewsToday,
      totalReviews: total,
      linesAnalyzed: totalLines > 1000 
        ? (totalLines / 1000).toFixed(1) + 'K' 
        : totalLines.toLocaleString(),
    });
  }, [initialData]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.username || 'Developer'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              What would you like to analyze today?
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Reviews Today', value: stats.reviewsToday, icon: Activity },
              { label: 'Total Reviews', value: stats.totalReviews, icon: History },
              { label: 'Lines Analyzed', value: stats.linesAnalyzed, icon: Code2 },
            ].map((stat) => (
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
                <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${card.bgGlow} blur-3xl opacity-0 transition-opacity group-hover:opacity-100`} />
                
                <div className="relative">
                  <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${card.gradient} p-4`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{card.title}</h2>
                  <p className="mt-3 text-muted-foreground">{card.description}</p>
                  
                  <div className="mt-6 flex items-center gap-2 text-primary">
                    <span className="font-medium">Get Started</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Activity</h2>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <Link
                    key={activity._id}
                    href={`/review/${activity._id}`}
                    className="block rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {activity.language ? `${activity.language.toUpperCase()} Review` : 'Code Review'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(activity.createdAt).toLocaleDateString('en-IN')} • 
                          {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-500">
                          {activity.response?.issues?.length || activity.failure_info?.length || 0} issues
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <History className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 font-medium text-foreground">No reviews yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Your recent code reviews will appear here
                </p>
                <Link
                  href="/review"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start First Review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}