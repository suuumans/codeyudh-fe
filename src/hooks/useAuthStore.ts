import { useStore } from '@tanstack/react-store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { authStore, authActions } from '@/stores/authStore'
import { userActions } from '@/stores/userStore'
import { authApi } from '@/api/authApi'
import { tokenStorage } from '@/lib/auth-storage'
import type { LoginCredentials, RegisterData } from '@/types'

// Main auth hook
export function useAuth() {
  const authState = useStore(authStore)
  
  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = tokenStorage.getToken()
      const userData = tokenStorage.getUserData()

      if (token && userData) {
        authActions.setUser(userData)
        userActions.setUser(userData)
      } else {
        authActions.logout()
        userActions.logout()
      }
    }

    checkExistingSession()
  }, [])

  return authState
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => {
      authActions.startAuth()
    },
    onSuccess: (response) => {
      // Store tokens and user data
      tokenStorage.setToken(response.token)
      tokenStorage.setRefreshToken(response.refreshToken)
      tokenStorage.setUserData(response.user)

      // Update stores
      authActions.setUser(response.user)
      userActions.setUser(response.user)

      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      authActions.setError(errorMessage)
    },
  })
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onMutate: () => {
      authActions.startAuth()
    },
    onSuccess: (response) => {
      // Store tokens and user data
      tokenStorage.setToken(response.token)
      tokenStorage.setRefreshToken(response.refreshToken)
      tokenStorage.setUserData(response.user)

      // Update stores
      authActions.setUser(response.user)
      userActions.setUser(response.user)

      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      authActions.setError(errorMessage)
    },
  })
}

// Logout function
export function useLogout() {
  const queryClient = useQueryClient()
  
  return () => {
    tokenStorage.clearAll()
    authActions.logout()
    userActions.logout()
    
    // Clear all cached queries
    queryClient.clear()
  }
}

// Current user query (for token refresh scenarios)
export function useCurrentUser() {
  const { isAuthenticated } = useStore(authStore)
  
  const query = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated && !!tokenStorage.getToken(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Handle success and error in useEffect
  useEffect(() => {
    if (query.data) {
      authActions.setUser(query.data)
      userActions.setUser(query.data)
      tokenStorage.setUserData(query.data)
    }
    
    if (query.error) {
      // If current user fetch fails, logout
      tokenStorage.clearAll()
      authActions.logout()
      userActions.logout()
    }
  }, [query.data, query.error])

  return query
}

// Auth actions
export function useAuthActions() {
  const login = useLogin()
  const register = useRegister()
  const logout = useLogout()
  
  return {
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout,
    clearError: authActions.clearError,
    isLoginLoading: login.isPending,
    isRegisterLoading: register.isPending,
    loginError: login.error?.message || null,
    registerError: register.error?.message || null,
  }
}

// Token utilities
export function useAuthToken() {
  const { isAuthenticated } = useStore(authStore)
  
  const getToken = () => tokenStorage.getToken()
  const getRefreshToken = () => tokenStorage.getRefreshToken()
  const hasValidToken = () => {
    const token = getToken()
    return !!token && isAuthenticated
  }
  
  return {
    getToken,
    getRefreshToken,
    hasValidToken,
    isAuthenticated,
  }
}

// Auth status
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user, error } = useStore(authStore)
  
  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    hasUser: !!user,
  }
}