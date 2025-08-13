import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { StatisticsCards, RecentActivity, ProgressCharts } from '@/components/dashboard'
import { useUserStore, useUserStatistics, useUserSubmissions } from '@/hooks/useUserStore'

function Dashboard() {
  const { user } = useAuth()
  const { statistics } = useUserStore()
  
  // Use TanStack Query to fetch data
  const { data: userStats, isLoading: statsLoading } = useUserStatistics()
  const { data: submissions, isLoading: submissionsLoading } = useUserSubmissions()
  
  const currentStats = userStats || statistics
  const recentSubmissions = submissions || []
  const loading = statsLoading || submissionsLoading

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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue your coding journey
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {currentStats && <StatisticsCards statistics={currentStats} />}

      {/* Progress Charts */}
      {currentStats && <ProgressCharts statistics={currentStats} />}

      {/* Recent Activity */}
      <RecentActivity submissions={recentSubmissions} loading={loading} />
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})