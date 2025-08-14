import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  progress: number
  status: 'loading' | 'success' | 'error' | 'idle'
  message?: string
  className?: string
}

export function ProgressIndicator({ 
  progress, 
  status, 
  message, 
  className 
}: ProgressIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-500'
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {message || `${Math.round(progress)}% complete`}
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2"
        />
      </CardContent>
    </Card>
  )
}

interface StepProgressProps {
  steps: Array<{
    id: string
    label: string
    status: 'pending' | 'active' | 'completed' | 'error'
  }>
  className?: string
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
            {
              'bg-gray-200 text-gray-600': step.status === 'pending',
              'bg-blue-500 text-white': step.status === 'active',
              'bg-green-500 text-white': step.status === 'completed',
              'bg-red-500 text-white': step.status === 'error',
            }
          )}>
            {step.status === 'active' && <Loader2 className="h-3 w-3 animate-spin" />}
            {step.status === 'completed' && <CheckCircle className="h-3 w-3" />}
            {step.status === 'error' && <XCircle className="h-3 w-3" />}
            {step.status === 'pending' && index + 1}
          </div>
          <span className={cn(
            'text-sm',
            {
              'text-gray-500': step.status === 'pending',
              'text-blue-600 font-medium': step.status === 'active',
              'text-green-600': step.status === 'completed',
              'text-red-600': step.status === 'error',
            }
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}