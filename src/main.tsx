import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { NetworkStatus } from '@/components/ui/network-status'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/queryClient'
import { registerServiceWorker } from './utils/serviceWorker'
import { initSentry } from './lib/sentry'
import * as Sentry from '@sentry/react'
import { initWebVitals } from './lib/webVitals'
import { healthCheckService } from './lib/healthCheck'
import './styles.css'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Initialize monitoring and analytics
initSentry()
initWebVitals()

// Register service worker for caching and offline support
if (import.meta.env.PROD) {
    registerServiceWorker().then((registration) => {
        if (registration) {
            console.log('Service Worker registered for production')
        }
    })
}

// Start periodic health checks in production
if (import.meta.env.PROD) {
    healthCheckService.startPeriodicChecks(300000) // Every 5 minutes
}

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={({ resetError }) => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-gray-600 mb-4">We've been notified about this error.</p>
                    <button 
                        onClick={resetError}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )}>
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <NetworkStatus />
                    <Toaster 
                        position="top-right"
                        expand={true}
                        richColors={true}
                        closeButton={true}
                    />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </ErrorBoundary>
        </Sentry.ErrorBoundary>
    </React.StrictMode>,
)
