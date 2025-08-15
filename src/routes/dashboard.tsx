import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { StatisticsCards, RecentActivity } from '@/components/dashboard'
import { LazyProgressCharts, preloadCharts } from '@/components/charts/LazyCharts'
import { useUserStore, useUserStatistics, useUserSubmissions } from '@/hooks/useUserStore'
import { 
  StatisticsCardsSkeleton, 
  ProgressChartsSkeleton, 
  RecentActivitySkeleton 
} from '@/components/ui/loading-skeletons'
import { ResponsiveContainer, ResponsiveStack } from '@/components/ui/responsive-container'
import { useEffect } from 'react'

function Dashboard() {
  const { user } = useAuth()
  const { statistics } = useUserStore()
  
  // Use TanStack Query to fetch data
  const { data: userStats, isLoading: statsLoading } = useUserStatistics()
  const { data: submissions, isLoading: submissionsLoading } = useUserSubmissions()
  
  const currentStats = userStats || statistics
  const recentSubmissions = Array.isArray(submissions) ? submissions : submissions?.data || []
  const loading = statsLoading || submissionsLoading

  // Preload charts when user data is available
  useEffect(() => {
    if (currentStats && !statsLoading) {
      preloadCharts()
    }
  }, [currentStats, statsLoading])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer size="xl" padding="md">
      <ResponsiveStack direction="vertical" gap="lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.username}!</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and continue your coding journey
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <StatisticsCardsSkeleton />
        ) : currentStats ? (
          <StatisticsCards statistics={currentStats} />
        ) : null}

        {/* Progress Charts */}
        {statsLoading ? (
          <ProgressChartsSkeleton />
        ) : currentStats ? (
          <LazyProgressCharts statistics={currentStats} />
        ) : null}

        {/* Recent Activity */}
        {submissionsLoading ? (
          <RecentActivitySkeleton />
        ) : (
          <RecentActivity submissions={recentSubmissions} loading={loading} />
        )}
      </ResponsiveStack>
    </ResponsiveContainer>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})