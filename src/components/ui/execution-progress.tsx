import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle, Clock, MemoryStick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExecutionStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration?: number
}

interface ExecutionProgressProps {
  steps: ExecutionStep[]
  currentStep?: string
  progress: number
  status: 'idle' | 'running' | 'completed' | 'failed'
  executionTime?: number
  memoryUsage?: number
  className?: string
}

export function ExecutionProgress({
  steps,
  progress,
  status,
  executionTime,
  memoryUsage,
  className,
}: ExecutionProgressProps) {
  const getStepIcon = (step: ExecutionStep) => {
    switch (step.status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />
    }
  }

  const getProgressColor = () => {
    switch (status) {
      case 'running':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {status === 'running' && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
          Code Execution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Execution Steps */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-md transition-colors',
                {
                  'bg-blue-50 dark:bg-blue-950/20': step.status === 'running',
                  'bg-green-50 dark:bg-green-950/20': step.status === 'completed',
                  'bg-red-50 dark:bg-red-950/20': step.status === 'failed',
                }
              )}
            >
              {getStepIcon(step)}
              <span className={cn(
                'flex-1 text-sm',
                {
                  'font-medium': step.status === 'running',
                  'text-muted-foreground': step.status === 'pending',
                }
              )}>
                {step.label}
              </span>
              {step.duration && (
                <span className="text-xs text-muted-foreground">
                  {step.duration}ms
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Execution Stats */}
        {(executionTime !== undefined || memoryUsage !== undefined) && (
          <div className="flex gap-4 pt-2 border-t">
            {executionTime !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{executionTime}ms</span>
              </div>
            )}
            {memoryUsage !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
                <span>{(memoryUsage / 1024 / 1024).toFixed(2)}MB</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface QuickExecutionProgressProps {
  status: 'idle' | 'running' | 'completed' | 'failed'
  message?: string
  progress?: number
  className?: string
}

export function QuickExecutionProgress({
  status,
  message,
  progress = 0,
  className,
}: QuickExecutionProgressProps) {
  if (status === 'idle') return null

  return (
    <div className={cn('flex items-center gap-3 p-3 bg-muted rounded-md', className)}>
      {status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
      {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
      
      <div className="flex-1">
        <div className="text-sm font-medium">
          {message || (status === 'running' ? 'Executing...' : status === 'completed' ? 'Completed' : 'Failed')}
        </div>
        {status === 'running' && progress > 0 && (
          <Progress value={progress} className="h-1 mt-1" />
        )}
      </div>
    </div>
  )
}