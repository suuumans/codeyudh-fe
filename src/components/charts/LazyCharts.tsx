import { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

// Lazy load chart components
const ProgressCharts = lazy(() => 
  import('../dashboard/ProgressCharts').then(module => ({
    default: module.ProgressCharts
  }))
)

// Loading fallback for charts
function ChartsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading charts...</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading charts...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export interface LazyProgressChartsProps {
  statistics: any
}

export function LazyProgressCharts(props: LazyProgressChartsProps) {
  return (
    <Suspense fallback={<ChartsSkeleton />}>
      <ProgressCharts {...props} />
    </Suspense>
  )
}

// Preload function
export const preloadCharts = () => {
  import('../dashboard/ProgressCharts')
}