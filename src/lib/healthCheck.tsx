/**
 * Health check utilities for monitoring application status
 */
import { useState, useCallback, useEffect } from 'react'

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: number
  checks: Record<string, {
    status: 'pass' | 'fail' | 'warn'
    message?: string
    duration?: number
    metadata?: Record<string, any>
  }>
  version: string
  uptime: number
}

interface HealthChecker {
  name: string
  check: () => Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string; metadata?: any }>
  timeout?: number
}

class HealthCheckService {
  private checkers: HealthChecker[] = []
  private startTime: number = Date.now()

  constructor() {
    // Register default health checkers
    this.registerDefaultCheckers()
  }

  // Register a health checker
  registerChecker(checker: HealthChecker) {
    this.checkers.push(checker)
  }

  // Run all health checks
  async runHealthChecks(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    const checks: HealthCheckResult['checks'] = {}
    
    // Run all checks in parallel with timeout
    const checkPromises = this.checkers.map(async (checker) => {
      const checkStart = Date.now()
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Health check timeout')), checker.timeout || 5000)
        })
        
        const result = await Promise.race([
          checker.check(),
          timeoutPromise
        ])
        
        checks[checker.name] = {
          ...result,
          duration: Date.now() - checkStart,
        }
      } catch (error) {
        checks[checker.name] = {
          status: 'fail',
          message: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - checkStart,
        }
      }
    })

    await Promise.allSettled(checkPromises)

    // Determine overall status
    const statuses = Object.values(checks).map(check => check.status)
    let overallStatus: HealthCheckResult['status'] = 'healthy'
    
    if (statuses.includes('fail')) {
      overallStatus = 'unhealthy'
    } else if (statuses.includes('warn')) {
      overallStatus = 'degraded'
    }

    return {
      status: overallStatus,
      timestamp: Date.now(),
      checks,
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      uptime: Date.now() - this.startTime,
    }
  }

  // Register default health checkers
  private registerDefaultCheckers() {
    // Browser API availability check
    this.registerChecker({
      name: 'browser_apis',
      check: async () => {
        const missingApis: string[] = []
        
        if (!('fetch' in window)) missingApis.push('fetch')
        if (!('localStorage' in window)) missingApis.push('localStorage')
        if (!('sessionStorage' in window)) missingApis.push('sessionStorage')
        if (!('WebSocket' in window)) missingApis.push('WebSocket')
        
        return {
          status: missingApis.length === 0 ? 'pass' : 'warn',
          message: missingApis.length > 0 ? `Missing APIs: ${missingApis.join(', ')}` : 'All APIs available',
          metadata: { missingApis }
        }
      }
    })

    // Memory usage check
    this.registerChecker({
      name: 'memory_usage',
      check: async () => {
        if ('memory' in performance) {
          const memory = (performance as any).memory
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
          const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
          const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
          
          const usagePercent = (usedMB / limitMB) * 100
          
          let status: 'pass' | 'warn' | 'fail' = 'pass'
          if (usagePercent > 90) status = 'fail'
          else if (usagePercent > 70) status = 'warn'
          
          return {
            status,
            message: `Memory usage: ${usedMB}MB / ${limitMB}MB (${usagePercent.toFixed(1)}%)`,
            metadata: { usedMB, totalMB, limitMB, usagePercent }
          }
        }
        
        return {
          status: 'warn',
          message: 'Memory API not available'
        }
      }
    })

    // Local storage check
    this.registerChecker({
      name: 'local_storage',
      check: async () => {
        try {
          const testKey = '__health_check_test__'
          localStorage.setItem(testKey, 'test')
          const value = localStorage.getItem(testKey)
          localStorage.removeItem(testKey)
          
          return {
            status: value === 'test' ? 'pass' : 'fail',
            message: value === 'test' ? 'Local storage working' : 'Local storage read/write failed'
          }
        } catch (error) {
          return {
            status: 'fail',
            message: `Local storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      }
    })

    // Network connectivity check
    this.registerChecker({
      name: 'network_connectivity',
      check: async () => {
        if ('onLine' in navigator) {
          const isOnline = navigator.onLine
          return {
            status: isOnline ? 'pass' : 'fail',
            message: isOnline ? 'Network available' : 'Network offline',
            metadata: { online: isOnline }
          }
        }
        
        return {
          status: 'warn',
          message: 'Network status API not available'
        }
      }
    })

    // Service worker check
    this.registerChecker({
      name: 'service_worker',
      check: async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration()
            return {
              status: registration ? 'pass' : 'warn',
              message: registration ? 'Service worker registered' : 'Service worker not registered',
              metadata: {
                registered: !!registration,
                scope: registration?.scope,
                state: registration?.active?.state
              }
            }
          } catch (error) {
            return {
              status: 'fail',
              message: `Service worker error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          }
        }
        
        return {
          status: 'warn',
          message: 'Service worker not supported'
        }
      }
    })

    // Performance check
    this.registerChecker({
      name: 'performance',
      check: async () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
          
          let status: 'pass' | 'warn' | 'fail' = 'pass'
          if (loadTime > 5000) status = 'fail'
          else if (loadTime > 3000) status = 'warn'
          
          return {
            status,
            message: `Page load time: ${loadTime.toFixed(0)}ms`,
            metadata: {
              loadTime: Math.round(loadTime),
              domContentLoaded: Math.round(domContentLoaded),
              firstPaint: Math.round(navigation.responseStart - navigation.fetchStart)
            }
          }
        }
        
        return {
          status: 'warn',
          message: 'Performance timing not available'
        }
      }
    })
  }

  // Get simple health status
  async getHealthStatus(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    const result = await this.runHealthChecks()
    return result.status
  }

  // Start periodic health checks
  startPeriodicChecks(intervalMs: number = 60000) {
    setInterval(async () => {
      const result = await this.runHealthChecks()
      
      // Log health status
      if (result.status !== 'healthy') {
        console.warn('Health check failed:', result)
      }
      
      // Send to monitoring service
      this.reportHealthStatus(result)
    }, intervalMs)
  }

  // Report health status to monitoring service
  private reportHealthStatus(result: HealthCheckResult) {
    if (import.meta.env.VITE_MONITORING_ENDPOINT) {
      fetch(import.meta.env.VITE_MONITORING_ENDPOINT + '/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      }).catch((error) => {
        console.error('Failed to report health status:', error)
      })
    }
  }
}

// Create global health check service
export const healthCheckService = new HealthCheckService()

// React hook for health checks
export function useHealthCheck() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runHealthCheck = useCallback(async () => {
    setLoading(true)
    try {
      const result = await healthCheckService.runHealthChecks()
      setHealthStatus(result)
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    runHealthCheck()
  }, [runHealthCheck])

  return {
    healthStatus,
    loading,
    runHealthCheck,
  }
}

// Health check component for admin/debug purposes
export function HealthCheckDisplay() {
  const { healthStatus, loading, runHealthCheck } = useHealthCheck()

  if (loading && !healthStatus) {
    return <div>Running health checks...</div>
  }

  if (!healthStatus) {
    return <div>Health check failed</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return 'text-green-600'
      case 'degraded':
      case 'warn':
        return 'text-yellow-600'
      case 'unhealthy':
      case 'fail':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">System Health</h3>
        <button
          onClick={runHealthCheck}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      <div className={`text-lg font-medium mb-4 ${getStatusColor(healthStatus.status)}`}>
        Overall Status: {healthStatus.status.toUpperCase()}
      </div>
      
      <div className="space-y-2">
        {Object.entries(healthStatus.checks).map(([name, check]) => (
          <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-medium">{name.replace(/_/g, ' ')}</span>
            <div className="text-right">
              <span className={`font-medium ${getStatusColor(check.status)}`}>
                {check.status.toUpperCase()}
              </span>
              {check.duration && (
                <span className="text-sm text-gray-500 ml-2">
                  ({check.duration}ms)
                </span>
              )}
              {check.message && (
                <div className="text-sm text-gray-600">{check.message}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <div>Version: {healthStatus.version}</div>
        <div>Uptime: {Math.round(healthStatus.uptime / 1000)}s</div>
        <div>Last Check: {new Date(healthStatus.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  )
}