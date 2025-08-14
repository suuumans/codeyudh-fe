import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  loading?: boolean
  error?: string | Error | null
  empty?: boolean
  emptyMessage?: string
  emptyAction?: {
    label: string
    onClick: () => void
  }
  retry?: () => void
  children: React.ReactNode
  skeleton?: React.ReactNode
  className?: string
}

export function LoadingState({
  loading = false,
  error,
  empty = false,
  emptyMessage = 'No data available',
  emptyAction,
  retry,
  children,
  skeleton,
  className,
}: LoadingStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {skeleton || (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{errorMessage}</span>
            {retry && (
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (empty) {
    return (
      <div className={cn('text-center py-8 space-y-4', className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
        {emptyAction && (
          <Button onClick={emptyAction.onClick} variant="outline">
            {emptyAction.label}
          </Button>
        )}
      </div>
    )
  }

  return <div className={className}>{children}</div>
}

interface InlineLoadingProps {
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function InlineLoading({
  loading = true,
  size = 'md',
  text,
  className,
}: InlineLoadingProps) {
  if (!loading) return null

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

interface LoadingOverlayProps {
  loading?: boolean
  text?: string
  children: React.ReactNode
  className?: string
}

export function LoadingOverlay({
  loading = false,
  text = 'Loading...',
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm text-muted-foreground">{text}</span>
          </div>
        </div>
      )}
    </div>
  )
}