import { useEffect } from 'react'
import type { ReactNode, ComponentType } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent } from '../ui/card'

interface ProtectedRouteProps {
    children: ReactNode
    fallback?: ReactNode
    redirectTo?: string
}

// Loading component for authentication check
function AuthLoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">
                        Checking authentication...
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

// Unauthorized component
function UnauthorizedFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground text-center mb-4">
                        You need to be logged in to access this page.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Redirecting to login...
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export function ProtectedRoute({
    children,
    fallback,
    redirectTo = '/login',
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Store the current location to redirect back after login
            const returnTo =
                location.pathname !== '/login'
                    ? location.pathname
                    : '/dashboard'

            // Redirect to login with return URL
            navigate({
                to: redirectTo,
                search: { returnTo },
                replace: true,
            })
        }
    }, [isAuthenticated, isLoading, navigate, redirectTo, location.pathname])

    // Show loading spinner while checking authentication
    if (isLoading) {
        return <AuthLoadingSpinner />
    }

    // Show fallback or default unauthorized component if not authenticated
    if (!isAuthenticated) {
        return fallback || <UnauthorizedFallback />
    }

    // Render children if authenticated
    return <>{children}</>
}

// Higher-order component version for easier usage
export function withProtectedRoute<P extends object>(
    Component: ComponentType<P>,
    options?: Omit<ProtectedRouteProps, 'children'>,
) {
    return function ProtectedComponent(props: P) {
        return (
            <ProtectedRoute {...options}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}

// Hook for checking if current route should be protected
export function useProtectedRoute(redirectTo?: string) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const checkAuth = () => {
        if (!isLoading && !isAuthenticated) {
            const returnTo = location.pathname
            navigate({
                to: redirectTo || '/login',
                search: { returnTo },
                replace: true,
            })
        }
    }

    return {
        isAuthenticated,
        isLoading,
        checkAuth,
        shouldRedirect: !isLoading && !isAuthenticated,
    }
}
