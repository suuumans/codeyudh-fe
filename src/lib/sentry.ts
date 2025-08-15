import * as Sentry from '@sentry/react'

// Initialize Sentry
export function initSentry() {
  // Only initialize in production or when explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      // Error filtering
      beforeSend(event, hint) {
        // Filter out known non-critical errors
        const error = hint.originalException
        if (error && typeof error === 'object' && 'message' in error) {
          const message = error.message as string
          
          // Skip network errors that are expected
          if (message.includes('NetworkError') || message.includes('fetch')) {
            return null
          }
          
          // Skip ResizeObserver errors (common browser quirk)
          if (message.includes('ResizeObserver')) {
            return null
          }
        }
        
        return event
      },
      // Additional configuration
      attachStacktrace: true,
      sendDefaultPii: false, // Don't send personally identifiable information
    })
  }
}

// Custom error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary

// Performance monitoring utilities
export function startTransaction(name: string, op: string) {
  return Sentry.startSpan({ name, op }, () => {})
}

export function addBreadcrumb(message: string, category: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  })
}

// User context
export function setUserContext(user: { id: string; username?: string; email?: string }) {
  Sentry.setUser({
    id: user.id,
    username: user.username,
    email: user.email,
  })
}

export function clearUserContext() {
  Sentry.setUser(null)
}

// Custom error reporting
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }
    Sentry.captureException(error)
  })
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }
    Sentry.captureMessage(message, level)
  })
}