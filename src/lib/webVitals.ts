import React, { useEffect } from 'react'
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'
import { captureMessage } from './sentry'

// Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
}

// Performance analytics interface
interface PerformanceAnalytics {
  sendMetric: (metric: Metric) => void
  sendCustomMetric: (name: string, value: number, unit?: string) => void
  trackPageLoad: (pageName: string) => void
  trackUserInteraction: (action: string, element?: string) => void
}

// Create analytics instance
class WebVitalsAnalytics implements PerformanceAnalytics {
  private metrics: Map<string, Metric> = new Map()
  private customMetrics: Array<{ name: string; value: number; unit?: string; timestamp: number }> = []

  sendMetric(metric: Metric) {
    this.metrics.set(metric.name, metric)
    
    // Determine performance rating
    const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS]
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good'
    
    if (threshold) {
      if (metric.value > threshold.poor) {
        rating = 'poor'
      } else if (metric.value > threshold.good) {
        rating = 'needs-improvement'
      }
    }

    // Send to analytics service
    this.reportMetric({
      name: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Web Vital: ${metric.name}`, {
        value: metric.value,
        rating,
        delta: metric.delta,
      })
    }
  }

  sendCustomMetric(name: string, value: number, unit = 'ms') {
    const metric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    }
    
    this.customMetrics.push(metric)
    
    // Send to analytics service
    this.reportCustomMetric(metric)

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Custom Metric: ${name}`, { value, unit })
    }
  }

  trackPageLoad(pageName: string) {
    const startTime = performance.now()
    
    // Track when page is fully loaded
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime
      this.sendCustomMetric(`page_load_${pageName}`, loadTime)
    }, { once: true })
  }

  trackUserInteraction(action: string, element?: string) {
    this.reportUserInteraction({
      action,
      element,
      timestamp: Date.now(),
      url: window.location.href,
    })

    if (import.meta.env.DEV) {
      console.log(`User Interaction: ${action}`, { element })
    }
  }

  private reportMetric(data: any) {
    // Send to your analytics service
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT + '/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(console.error)
    }

    // Also send to Sentry for performance monitoring
    captureMessage(`Web Vital: ${data.name}`, 'info', {
      performance: data,
    })
  }

  private reportCustomMetric(data: any) {
    // Send to your analytics service
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT + '/custom-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(console.error)
    }
  }

  private reportUserInteraction(data: any) {
    // Send to your analytics service
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT + '/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(console.error)
    }
  }

  // Get current metrics summary
  getMetricsSummary() {
    const summary: Record<string, any> = {}
    
    this.metrics.forEach((metric, name) => {
      summary[name] = {
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
      }
    })
    
    return summary
  }

  // Get performance score (0-100)
  getPerformanceScore(): number {
    const metrics = Array.from(this.metrics.values())
    if (metrics.length === 0) return 0

    let totalScore = 0
    let validMetrics = 0

    metrics.forEach((metric) => {
      const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS]
      if (threshold) {
        let score = 100
        if (metric.value > threshold.poor) {
          score = 0
        } else if (metric.value > threshold.good) {
          score = 50
        }
        totalScore += score
        validMetrics++
      }
    })

    return validMetrics > 0 ? Math.round(totalScore / validMetrics) : 0
  }
}

// Create global analytics instance
export const analytics = new WebVitalsAnalytics()

// Initialize Web Vitals monitoring
export function initWebVitals() {
  // Core Web Vitals
  onCLS(analytics.sendMetric)
  onFID(analytics.sendMetric)
  onFCP(analytics.sendMetric)
  onLCP(analytics.sendMetric)
  onTTFB(analytics.sendMetric)

  // Track initial page load
  analytics.trackPageLoad('initial')
}

// Custom performance measurement utilities
export function measureAsyncOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now()
  
  return operation().finally(() => {
    const duration = performance.now() - startTime
    analytics.sendCustomMetric(`async_${name}`, duration)
  })
}

export function measureSyncOperation<T>(
  name: string,
  operation: () => T
): T {
  const startTime = performance.now()
  const result = operation()
  const duration = performance.now() - startTime
  
  analytics.sendCustomMetric(`sync_${name}`, duration)
  return result
}

// React component performance tracking
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: P) {
    const startTime = performance.now()
    
    useEffect(() => {
      const renderTime = performance.now() - startTime
      analytics.sendCustomMetric(`component_render_${componentName}`, renderTime)
    }, [])

    return React.createElement(Component, props)
  }
}

// Export analytics instance for direct use
export { analytics as webVitalsAnalytics }