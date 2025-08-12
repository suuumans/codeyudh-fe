/**
 * Token storage utilities for managing authentication tokens
 * Supports both localStorage and sessionStorage based on user preference
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

export interface TokenStorage {
    getToken(): string | null
    setToken(token: string): void
    getRefreshToken(): string | null
    setRefreshToken(token: string): void
    getUserData(): any | null
    setUserData(user: any): void
    clearAll(): void
}

class LocalStorageManager implements TokenStorage {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY)
    }

    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token)
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    }

    setRefreshToken(token: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, token)
    }

    getUserData(): any | null {
        const userData = localStorage.getItem(USER_KEY)
        return userData ? JSON.parse(userData) : null
    }

    setUserData(user: any): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    clearAll(): void {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }
}

class SessionStorageManager implements TokenStorage {
    getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY)
    }

    setToken(token: string): void {
        sessionStorage.setItem(TOKEN_KEY, token)
    }

    getRefreshToken(): string | null {
        return sessionStorage.getItem(REFRESH_TOKEN_KEY)
    }

    setRefreshToken(token: string): void {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, token)
    }

    getUserData(): any | null {
        const userData = sessionStorage.getItem(USER_KEY)
        return userData ? JSON.parse(userData) : null
    }

    setUserData(user: any): void {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    clearAll(): void {
        sessionStorage.removeItem(TOKEN_KEY)
        sessionStorage.removeItem(REFRESH_TOKEN_KEY)
        sessionStorage.removeItem(USER_KEY)
    }
}

// Default to localStorage, can be switched to sessionStorage if needed
export const tokenStorage: TokenStorage = new LocalStorageManager()

// Alternative session storage for temporary sessions
export const sessionTokenStorage: TokenStorage = new SessionStorageManager()
