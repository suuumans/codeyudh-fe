import { QueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/types'

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as any).error === 'object'
  )
}

const shouldRetry = (failureCount: number, error: unknown): boolean => {
  // Don't retry more than 3 times
  if (failureCount >= 3) return false
  
  // Don't retry on client errors (4xx) except for specific cases
  if (isApiError(error)) {
    const code = error.error.code
    
    // Don't retry on authentication/authorization errors
    if (['UNAUTHORIZED', 'FORBIDDEN'].includes(code)) {
      return false
    }
    
    // Don't retry on validation errors
    if (code === 'VALIDATION_ERROR') {
      return false
    }
    
    // Don't retry on not found errors
    if (code === 'NOT_FOUND') {
      return false
    }
    
    // Retry on server errors and network issues
    if (['SERVER_ERROR', 'NETWORK_ERROR', 'TIMEOUT'].includes(code)) {
      return true
    }
    
    // Retry on rate limiting with exponential backoff
    if (code === 'RATE_LIMIT_EXCEEDED') {
      return true
    }
  }
  
  // Default: retry on network errors and 5xx status codes
  return true
}

const getRetryDelay = (attemptIndex: number, error: unknown): number => {
  // Exponential backoff: 1s, 2s, 4s
  const baseDelay = 1000
  const delay = baseDelay * Math.pow(2, attemptIndex)
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay
  
  // Special handling for rate limiting
  if (isApiError(error) && error.error.code === 'RATE_LIMIT_EXCEEDED') {
    // Longer delay for rate limiting
    return delay * 2 + jitter
  }
  
  return delay + jitter
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: shouldRetry,
      retryDelay: getRetryDelay,
      // Refetch on window focus for important data
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Only retry mutations on network errors, not client errors
        if (isApiError(error)) {
          const code = error.error.code
          return ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR'].includes(code) && failureCount < 2
        }
        return false
      },
      retryDelay: getRetryDelay,
    },
  },
})