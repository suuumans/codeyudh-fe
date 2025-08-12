import { useEffect } from 'react'
import type { ReactNode, ComponentType } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'

interface PublicRouteProps {
    children: ReactNode
    redirectTo?: string
    redirectIfAuthenticated?: boolean
}

/**
 * PublicRoute component for handling routes that should be accessible to non-authenticated users
 * Optionally redirects authenticated users away from auth pages (like login/register)
 */
export function PublicRoute({
    children,
    redirectTo = '/dashboard',
    redirectIfAuthenticated = true,
}: PublicRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && isAuthenticated && redirectIfAuthenticated) {
            // Check if there's a return URL in the search params
            const searchParams = new URLSearchParams(window.location.search)
            const returnTo = searchParams.get('returnTo')

            // Redirect to return URL or default redirect
            const destination =
                returnTo && returnTo !== '/login' && returnTo !== '/register'
                    ? returnTo
                    : redirectTo

            navigate({
                to: destination,
                replace: true,
            })
        }
    }, [
        isAuthenticated,
        isLoading,
        navigate,
        redirectTo,
        redirectIfAuthenticated,
    ])

    // Don't render anything while loading or if we're about to redirect
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // If authenticated and should redirect, don't render children
    if (isAuthenticated && redirectIfAuthenticated) {
        return null
    }

    return <>{children}</>
}

// Higher-order component version
export function withPublicRoute<P extends object>(
    Component: ComponentType<P>,
    options?: Omit<PublicRouteProps, 'children'>,
) {
    return function PublicComponent(props: P) {
        return (
            <PublicRoute {...options}>
                <Component {...props} />
            </PublicRoute>
        )
    }
}
