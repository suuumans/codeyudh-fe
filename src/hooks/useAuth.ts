import { useAuth as useAuthContext } from '../contexts/AuthContext'
import { tokenStorage } from '../lib/auth-storage'

// Re-export the main useAuth hook
export { useAuth } from '../contexts/AuthContext'

// Additional auth-related hooks and utilities

/**
 * Hook to check if user has a valid token
 */
export function useAuthToken() {
    const { isAuthenticated } = useAuthContext()

    const getToken = () => tokenStorage.getToken()
    const getRefreshToken = () => tokenStorage.getRefreshToken()

    return {
        isAuthenticated,
        getToken,
        getRefreshToken,
        hasToken: !!getToken(),
    }
}

/**
 * Hook for auth status checks
 */
export function useAuthStatus() {
    const { isAuthenticated, isLoading, user } = useAuthContext()

    return {
        isAuthenticated,
        isLoading,
        isLoggedIn: isAuthenticated && !!user,
        user,
    }
}

/**
 * Hook for auth actions
 */
export function useAuthActions() {
    const { login, register, logout, clearError } = useAuthContext()

    return {
        login,
        register,
        logout,
        clearError,
    }
}
