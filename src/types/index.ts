// Re-export all types for easy importing
export * from './user'
export * from './problem'
export * from './submission'
export * from './api'

// Common utility types
export type Theme = 'light' | 'dark'

export interface LoadingState {
    isLoading: boolean
    error?: string | null
}
