import { useEffect } from 'react'
import { handleError } from '@/lib/error-utils'

export function useApiErrorToast(error: unknown, options?: {
  context?: string
  onRetry?: () => void
}) {
  useEffect(() => {
    if (!error) return
    
    handleError(error, {
      showToast: true,
      context: options?.context,
      onRetry: options?.onRetry,
    })
  }, [error, options?.context, options?.onRetry])
}
