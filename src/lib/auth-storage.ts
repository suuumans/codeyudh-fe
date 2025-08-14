/**
 * Token storage utilities for managing authentication tokens
 * Supports both localStorage and sessionStorage based on user preference
 */

import type { AuthTokens, User } from '@/types'

const AUTH_TOKENS_KEY = 'auth_tokens'
const USER_KEY = 'user_data'

export interface TokenStorage {
    getAuthTokens(): AuthTokens | null
    setAuthTokens(tokens: AuthTokens): void
    getUserData(): User | null
    setUserData(user: User): void
    clearAll(): void
}

class LocalStorageManager implements TokenStorage {
    getAuthTokens(): AuthTokens | null {
        const tokens = localStorage.getItem(AUTH_TOKENS_KEY)
        return tokens ? JSON.parse(tokens) : null
    }

    setAuthTokens(tokens: AuthTokens): void {
        localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens))
    }

    getUserData(): User | null {
        const userData = localStorage.getItem(USER_KEY)
        if (!userData) return null
        
        const parsed = JSON.parse(userData)
        // Convert date strings back to Date objects
        return {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            updatedAt: new Date(parsed.updatedAt)
        }
    }

    setUserData(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    clearAll(): void {
        localStorage.removeItem(AUTH_TOKENS_KEY)
        localStorage.removeItem(USER_KEY)
    }
}

class SessionStorageManager implements TokenStorage {
    getAuthTokens(): AuthTokens | null {
        const tokens = sessionStorage.getItem(AUTH_TOKENS_KEY)
        return tokens ? JSON.parse(tokens) : null
    }

    setAuthTokens(tokens: AuthTokens): void {
        sessionStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens))
    }

    getUserData(): User | null {
        const userData = sessionStorage.getItem(USER_KEY)
        if (!userData) return null
        
        const parsed = JSON.parse(userData)
        // Convert date strings back to Date objects
        return {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            updatedAt: new Date(parsed.updatedAt)
        }
    }

    setUserData(user: User): void {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    clearAll(): void {
        sessionStorage.removeItem(AUTH_TOKENS_KEY)
        sessionStorage.removeItem(USER_KEY)
    }
}

// Default to localStorage, can be switched to sessionStorage if needed
export const tokenStorage: TokenStorage = new LocalStorageManager()

// Alternative session storage for temporary sessions
export const sessionTokenStorage: TokenStorage = new SessionStorageManager()

// Export convenience functions
export const getAuthTokens = () => tokenStorage.getAuthTokens()
export const setAuthTokens = (tokens: AuthTokens) => tokenStorage.setAuthTokens(tokens)
export const getUserData = () => tokenStorage.getUserData()
export const setUserData = (user: User) => tokenStorage.setUserData(user)
export const clearAuthTokens = () => tokenStorage.clearAll()
