/**
 * User analytics and feature usage tracking
 */
import React, { useEffect } from 'react'

interface UserEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: number
}

interface UserProperties {
  userId: string
  username?: string
  email?: string
  plan?: string
  signupDate?: string
  lastActive?: string
  [key: string]: any
}

class UserAnalytics {
  private userId: string | null = null
  private userProperties: UserProperties | null = null
  private sessionId: string
  private sessionStartTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()
    
    // Track session start
    this.track('session_start', {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        sessionId: this.sessionId,
        duration: Date.now() - this.sessionStartTime,
      })
    })
  }

  // Set user identity
  identify(userId: string, properties?: Partial<UserProperties>) {
    this.userId = userId
    this.userProperties = {
      userId,
      ...properties,
    }

    this.sendEvent({
      event: 'user_identify',
      properties: this.userProperties,
      userId,
    })
  }

  // Clear user identity (logout)
  reset() {
    this.track('user_logout', { userId: this.userId })
    this.userId = null
    this.userProperties = null
  }

  // Track events
  track(event: string, properties?: Record<string, any>) {
    const eventData: UserEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now(),
      },
      userId: this.userId || undefined,
      timestamp: Date.now(),
    }

    this.sendEvent(eventData)

    // Log in development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', eventData)
    }
  }

  // Track page views
  page(pageName: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page: pageName,
      title: document.title,
      ...properties,
    })
  }

  // Feature-specific tracking methods
  trackProblemView(problemId: string, difficulty: string, topics: string[]) {
    this.track('problem_view', {
      problemId,
      difficulty,
      topics,
    })
  }

  trackCodeRun(problemId: string, language: string, success: boolean, executionTime?: number) {
    this.track('code_run', {
      problemId,
      language,
      success,
      executionTime,
    })
  }

  trackCodeSubmission(problemId: string, language: string, success: boolean, attempts: number) {
    this.track('code_submission', {
      problemId,
      language,
      success,
      attempts,
    })
  }

  trackProblemSolved(problemId: string, language: string, attempts: number, timeSpent: number) {
    this.track('problem_solved', {
      problemId,
      language,
      attempts,
      timeSpent,
    })
  }

  trackFilterUsage(filterType: string, filterValue: string) {
    this.track('filter_usage', {
      filterType,
      filterValue,
    })
  }

  trackSearchUsage(query: string, resultsCount: number) {
    this.track('search_usage', {
      query: query.length > 50 ? query.substring(0, 50) + '...' : query, // Truncate long queries
      queryLength: query.length,
      resultsCount,
    })
  }

  trackEditorAction(action: string, language?: string, feature?: string) {
    this.track('editor_action', {
      action,
      language,
      feature,
    })
  }

  trackThemeChange(theme: string) {
    this.track('theme_change', {
      theme,
    })
  }

  trackError(error: string, context?: Record<string, any>) {
    this.track('error_occurred', {
      error,
      context,
    })
  }

  // A/B testing support
  trackExperiment(experimentName: string, variant: string) {
    this.track('experiment_view', {
      experimentName,
      variant,
    })
  }

  // Conversion tracking
  trackConversion(conversionType: string, value?: number) {
    this.track('conversion', {
      conversionType,
      value,
    })
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, context?: Record<string, any>) {
    this.track('performance_metric', {
      metric,
      value,
      context,
    })
  }

  // Send event to analytics service
  private sendEvent(eventData: UserEvent) {
    // Send to your analytics service
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT + '/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }).catch((error) => {
        console.error('Failed to send analytics event:', error)
      })
    }

    // Also send to other analytics services if configured
    this.sendToGoogleAnalytics(eventData)
    this.sendToMixpanel(eventData)
  }

  private sendToGoogleAnalytics(eventData: UserEvent) {
    // Google Analytics 4 integration
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', eventData.event, {
        ...eventData.properties,
        user_id: eventData.userId,
      })
    }
  }

  private sendToMixpanel(eventData: UserEvent) {
    // Mixpanel integration
    if (typeof (window as any).mixpanel !== 'undefined') {
      if (eventData.userId) {
        (window as any).mixpanel.identify(eventData.userId)
      }
      (window as any).mixpanel.track(eventData.event, eventData.properties)
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime,
      duration: Date.now() - this.sessionStartTime,
      userId: this.userId,
    }
  }

  // Batch event sending for performance
  private eventQueue: UserEvent[] = []
  private batchTimeout: NodeJS.Timeout | null = null

  private queueEvent(eventData: UserEvent) {
    this.eventQueue.push(eventData)
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
    }
    
    this.batchTimeout = setTimeout(() => {
      this.flushEventQueue()
    }, 1000) // Send batch every second
  }

  private flushEventQueue() {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT + '/events/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      }).catch((error) => {
        console.error('Failed to send batch analytics events:', error)
        // Re-queue failed events
        this.eventQueue.unshift(...events)
      })
    }
  }
}

// Create global analytics instance
export const userAnalytics = new UserAnalytics()

// React hook for analytics
export function useAnalytics() {
  return {
    track: userAnalytics.track.bind(userAnalytics),
    page: userAnalytics.page.bind(userAnalytics),
    identify: userAnalytics.identify.bind(userAnalytics),
    reset: userAnalytics.reset.bind(userAnalytics),
    trackProblemView: userAnalytics.trackProblemView.bind(userAnalytics),
    trackCodeRun: userAnalytics.trackCodeRun.bind(userAnalytics),
    trackCodeSubmission: userAnalytics.trackCodeSubmission.bind(userAnalytics),
    trackProblemSolved: userAnalytics.trackProblemSolved.bind(userAnalytics),
    trackFilterUsage: userAnalytics.trackFilterUsage.bind(userAnalytics),
    trackSearchUsage: userAnalytics.trackSearchUsage.bind(userAnalytics),
    trackEditorAction: userAnalytics.trackEditorAction.bind(userAnalytics),
    trackThemeChange: userAnalytics.trackThemeChange.bind(userAnalytics),
    trackError: userAnalytics.trackError.bind(userAnalytics),
  }
}

// Higher-order component for automatic page tracking
export function withPageTracking<P extends object>(
  Component: React.ComponentType<P>,
  pageName: string
) {
  return function PageTrackedComponent(props: P) {
    useEffect(() => {
      userAnalytics.page(pageName)
    }, [])

    return React.createElement(Component, props)
  }
}