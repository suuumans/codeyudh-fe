import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { userAnalytics } from '@/lib/userAnalytics'
import { setUserContext, clearUserContext } from '@/lib/sentry'
import { webVitalsAnalytics } from '@/lib/webVitals'

/**
 * Hook to integrate monitoring and analytics with user authentication
 */
export function useMonitoring() {
  const { user, isAuthenticated } = useAuth()

  // Set user context for monitoring when user logs in/out
  useEffect(() => {
    if (isAuthenticated && user) {
      // Set user context for Sentry
      setUserContext({
        id: user.id,
        username: user.username,
        email: user.email,
      })

      // Identify user for analytics
      userAnalytics.identify(user.id, {
        username: user.username,
        email: user.email,
        signupDate: user.createdAt?.toISOString(),
        lastActive: new Date().toISOString(),
      })
    } else {
      // Clear user context when logged out
      clearUserContext()
      userAnalytics.reset()
    }
  }, [isAuthenticated, user])

  // Track page views automatically
  useEffect(() => {
    const handleRouteChange = () => {
      const pageName = window.location.pathname
      userAnalytics.page(pageName)
      
      // Track performance for page loads
      webVitalsAnalytics.trackPageLoad(pageName)
    }

    // Track initial page load
    handleRouteChange()

    // Listen for route changes (for SPA navigation)
    window.addEventListener('popstate', handleRouteChange)
    
    // For TanStack Router, we might need to listen to router events
    // This is a simplified approach - you might need to integrate with your router
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(handleRouteChange, 0)
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(handleRouteChange, 0)
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  // Track user interactions
  const trackInteraction = (action: string, element?: string, metadata?: Record<string, any>) => {
    userAnalytics.track('user_interaction', {
      action,
      element,
      ...metadata,
    })
    
    webVitalsAnalytics.trackUserInteraction(action, element)
  }

  // Track errors
  const trackError = (error: Error, context?: Record<string, any>) => {
    userAnalytics.trackError(error.message, {
      stack: error.stack,
      ...context,
    })
  }

  // Track performance metrics
  const trackPerformance = (metric: string, value: number, context?: Record<string, any>) => {
    userAnalytics.trackPerformance(metric, value, context)
    webVitalsAnalytics.sendCustomMetric(metric, value)
  }

  return {
    trackInteraction,
    trackError,
    trackPerformance,
    // Re-export analytics methods for convenience
    track: userAnalytics.track.bind(userAnalytics),
    trackProblemView: userAnalytics.trackProblemView.bind(userAnalytics),
    trackCodeRun: userAnalytics.trackCodeRun.bind(userAnalytics),
    trackCodeSubmission: userAnalytics.trackCodeSubmission.bind(userAnalytics),
    trackProblemSolved: userAnalytics.trackProblemSolved.bind(userAnalytics),
    trackFilterUsage: userAnalytics.trackFilterUsage.bind(userAnalytics),
    trackSearchUsage: userAnalytics.trackSearchUsage.bind(userAnalytics),
    trackEditorAction: userAnalytics.trackEditorAction.bind(userAnalytics),
    trackThemeChange: userAnalytics.trackThemeChange.bind(userAnalytics),
  }
}