import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  exponentialBackoff?: boolean
}

export const useRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false)
  const queryClient = useQueryClient()

  const retry = useCallback(async (
    fn: () => Promise<any>,
    options: RetryOptions = {}
  ) => {
    const {
      maxAttempts = 3,
      delay = 1000,
      exponentialBackoff = true
    } = options

    setIsRetrying(true)

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await fn()
        setIsRetrying(false)
        return result
      } catch (error) {
        if (attempt === maxAttempts) {
          setIsRetrying(false)
          throw error
        }

        // Calculate delay for next attempt
        const currentDelay = exponentialBackoff 
          ? delay * Math.pow(2, attempt - 1)
          : delay

        // Add jitter to prevent thundering herd
        const jitter = Math.random() * 0.1 * currentDelay
        
        await new Promise(resolve => 
          setTimeout(resolve, currentDelay + jitter)
        )
      }
    }
  }, [])

  const retryQuery = useCallback((queryKey: any[]) => {
    return queryClient.refetchQueries({ queryKey })
  }, [queryClient])

  const retryAllQueries = useCallback(() => {
    return queryClient.refetchQueries()
  }, [queryClient])

  const invalidateAndRetry = useCallback((queryKey: any[]) => {
    queryClient.invalidateQueries({ queryKey })
    return queryClient.refetchQueries({ queryKey })
  }, [queryClient])

  return {
    retry,
    retryQuery,
    retryAllQueries,
    invalidateAndRetry,
    isRetrying
  }
}