import { Store } from '@tanstack/store'
import type { User } from '@/types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const authStore = new Store<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check for existing session
  error: null,
})

// Actions
export const authActions = {
  setUser: (user: User | null) => {
    authStore.setState((state) => ({
      ...state,
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }))
  },

  setLoading: (isLoading: boolean) => {
    authStore.setState((state) => ({
      ...state,
      isLoading,
    }))
  },

  setError: (error: string | null) => {
    authStore.setState((state) => ({
      ...state,
      error,
      isLoading: false,
    }))
  },

  clearError: () => {
    authStore.setState((state) => ({
      ...state,
      error: null,
    }))
  },

  logout: () => {
    authStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  },

  startAuth: () => {
    authStore.setState((state) => ({
      ...state,
      isLoading: true,
      error: null,
    }))
  },
}