import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiError } from '@/types'

export const useGlobalErrorHandler = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      if (isApiError(event.reason)) {
        handleApiError(event.reason)
      } else {
        toast.error('An unexpected error occurred')
      }
      
      // Prevent the default browser error handling
      event.preventDefault()
    }

    // Global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      toast.error('A JavaScript error occurred')
    }

    // Set up global error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Set up query client error handling
    queryClient.setMutationDefaults(['*'], {
      onError: (error) => {
        if (isApiError(error)) {
          handleApiError(error)
        }
      }
    })

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [queryClient])
}

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as any).error === 'object' &&
    'code' in (error as any).error &&
    'message' in (error as any).error
  )
}

const handleApiError = (error: ApiError) => {
  const { code, message, details } = error.error
  
  // Don't show toast for certain error types that are handled elsewhere
  const silentErrors = ['UNAUTHORIZED', 'FORBIDDEN']
  if (silentErrors.includes(code)) {
    return
  }
  
  let toastMessage = message
  let toastDescription = getErrorDescription(code)
  
  // Add field-specific errors if available
  if (details) {
    const fieldErrors = Object.entries(details)
      .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
      .join('\n')
    toastDescription = fieldErrors
  }
  
  toast.error(toastMessage, {
    description: toastDescription,
    duration: getErrorDuration(code),
  })
}

const getErrorDescription = (code: string): string => {
  const descriptions: Record<string, string> = {
    'VALIDATION_ERROR': 'Please check your input and try again',
    'NOT_FOUND': 'The requested resource was not found',
    'RATE_LIMIT_EXCEEDED': 'Please wait a moment before trying again',
    'SERVER_ERROR': 'Our servers are experiencing issues',
    'NETWORK_ERROR': 'Please check your internet connection',
    'TIMEOUT': 'The request took too long to complete',
  }
  
  return descriptions[code] || ''
}

const getErrorDuration = (code: string): number => {
  // Longer duration for important errors
  const longDurationErrors = ['SERVER_ERROR', 'NETWORK_ERROR']
  return longDurationErrors.includes(code) ? 8000 : 5000
}