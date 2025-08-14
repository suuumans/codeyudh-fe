import { toast } from 'sonner'
import type { ApiError } from '@/types'

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as any).error === 'object' &&
    'code' in (error as any).error &&
    'message' in (error as any).error
  )
}

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

export const getErrorCode = (error: unknown): string | null => {
  if (isApiError(error)) {
    return error.error.code
  }
  
  return null
}

export const isNetworkError = (error: unknown): boolean => {
  const code = getErrorCode(error)
  return code === 'NETWORK_ERROR' || code === 'TIMEOUT'
}

export const isAuthError = (error: unknown): boolean => {
  const code = getErrorCode(error)
  return code === 'UNAUTHORIZED' || code === 'FORBIDDEN'
}

export const isValidationError = (error: unknown): boolean => {
  const code = getErrorCode(error)
  return code === 'VALIDATION_ERROR'
}

export const isServerError = (error: unknown): boolean => {
  const code = getErrorCode(error)
  return code === 'SERVER_ERROR'
}

export const shouldRetryError = (error: unknown): boolean => {
  const code = getErrorCode(error)
  
  if (!code) return false
  
  // Retry on network and server errors
  const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR', 'RATE_LIMIT_EXCEEDED']
  return retryableCodes.includes(code)
}

export const handleError = (error: unknown, options?: {
  showToast?: boolean
  context?: string
  onRetry?: () => void
}) => {
  const { showToast = true, context, onRetry } = options || {}
  
  console.error(`Error${context ? ` in ${context}` : ''}:`, error)
  
  if (!showToast) return
  
  const message = getErrorMessage(error)
  const code = getErrorCode(error)
  
  // Don't show toast for auth errors (handled by auth system)
  if (isAuthError(error)) return
  
  let toastOptions: any = {
    description: getErrorDescription(code),
  }
  
  // Add retry button for retryable errors
  if (shouldRetryError(error) && onRetry) {
    toastOptions.action = {
      label: 'Retry',
      onClick: onRetry,
    }
  }
  
  // Add field errors for validation errors
  if (isApiError(error) && error.error.details) {
    const fieldErrors = Object.entries(error.error.details)
      .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
      .join('\n')
    toastOptions.description = fieldErrors
  }
  
  toast.error(message, toastOptions)
}

const getErrorDescription = (code: string | null): string => {
  if (!code) return ''
  
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

export const createErrorHandler = (context: string, onRetry?: () => void) => {
  return (error: unknown) => handleError(error, { context, onRetry })
}