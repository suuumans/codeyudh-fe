import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { UserStatistics } from '@/types'
import { Trophy, Target, TrendingUp, Calendar } from 'lucide-react'

interface StatisticsCardsProps {
  statistics: UserStatistics
}

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const totalAttempted = statistics.totalSolved + Math.round(statistics.totalSolved / (statistics.acceptanceRate / 100) - statistics.totalSolved)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Solved */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalSolved}</div>
          <p className="text-xs text-muted-foreground">
            out of {totalAttempted} attempted
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.acceptanceRate}%</div>
          <Progress value={statistics.acceptanceRate} className="mt-2" />
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.currentStreak}</div>
          <p className="text-xs text-muted-foreground">
            Max: {statistics.maxStreak} days
          </p>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Ranking</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{statistics.ranking}</div>
          <p className="text-xs text-muted-foreground">
            Keep solving to improve!
          </p>
        </CardContent>
      </Card>

      {/* Difficulty Distribution */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Easy
              </Badge>
              <span className="text-sm font-medium">{statistics.easySolved}</span>
              <Progress 
                value={(statistics.easySolved / statistics.totalSolved) * 100} 
                className="w-20 h-2" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Medium
              </Badge>
              <span className="text-sm font-medium">{statistics.mediumSolved}</span>
              <Progress 
                value={(statistics.mediumSolved / statistics.totalSolved) * 100} 
                className="w-20 h-2" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Hard
              </Badge>
              <span className="text-sm font-medium">{statistics.hardSolved}</span>
              <Progress 
                value={(statistics.hardSolved / statistics.totalSolved) * 100} 
                className="w-20 h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}