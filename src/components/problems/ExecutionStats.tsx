import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Clock, MemoryStick, Zap, TrendingUp } from 'lucide-react'

export interface ExecutionStats {
  runtime: number
  memory: number
  runtimePercentile?: number
  memoryPercentile?: number
}

interface ExecutionStatsProps {
  stats: ExecutionStats
  loading?: boolean
}

export function ExecutionStats({ stats, loading = false }: ExecutionStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRuntimeColor = (runtime: number) => {
    if (runtime < 100) return 'text-green-600'
    if (runtime < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-600'
    if (memory < 100) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-600'
    if (percentile >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            Execution Statistics
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Runtime */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3" />
                  <span className="text-muted-foreground">Runtime</span>
                </div>
                <span className={`text-sm font-medium ${getRuntimeColor(stats.runtime)}`}>
                  {stats.runtime}ms
                </span>
              </div>
              {stats.runtimePercentile !== undefined && (
                <div className="space-y-1">
                  <Progress value={stats.runtimePercentile} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beats {stats.runtimePercentile}%</span>
                    <span className={getPercentileColor(stats.runtimePercentile)}>
                      {stats.runtimePercentile >= 80 ? 'Excellent' : 
                       stats.runtimePercentile >= 50 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Memory */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <MemoryStick className="h-3 w-3" />
                  <span className="text-muted-foreground">Memory</span>
                </div>
                <span className={`text-sm font-medium ${getMemoryColor(stats.memory)}`}>
                  {stats.memory}MB
                </span>
              </div>
              {stats.memoryPercentile !== undefined && (
                <div className="space-y-1">
                  <Progress value={stats.memoryPercentile} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beats {stats.memoryPercentile}%</span>
                    <span className={getPercentileColor(stats.memoryPercentile)}>
                      {stats.memoryPercentile >= 80 ? 'Excellent' : 
                       stats.memoryPercentile >= 50 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overall Performance Indicator */}
          {(stats.runtimePercentile !== undefined && stats.memoryPercentile !== undefined) && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-3 w-3" />
                <span className="text-muted-foreground">Overall Performance:</span>
                <span className={`font-medium ${
                  getPercentileColor((stats.runtimePercentile + stats.memoryPercentile) / 2)
                }`}>
                  {((stats.runtimePercentile + stats.memoryPercentile) / 2) >= 80 ? 'Excellent' : 
                   ((stats.runtimePercentile + stats.memoryPercentile) / 2) >= 50 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}