import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { setAuthTokens, setUserData, clearAuthTokens } from '@/lib/auth-storage'
import type { LoginCredentials, RegisterData, User } from '@/types'

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.login,
    onMutate: async (credentials) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['auth', 'user'] })
      
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(['auth', 'user'])
      
      // Return a context object with the snapshotted value
      return { previousUser }
    },
    onSuccess: (data) => {
      setAuthTokens(data.tokens)
      setUserData(data.user)
      queryClient.setQueryData(['auth', 'user'], data.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error, variables, context) => {
      clearAuthTokens()
      queryClient.removeQueries({ queryKey: ['auth'] })
      
      // Restore previous user data if it existed
      if (context?.previousUser) {
        queryClient.setQueryData(['auth', 'user'], context.previousUser)
      }
    }
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuthTokens(data.tokens)
      setUserData(data.user)
      queryClient.setQueryData(['auth', 'user'], data.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      clearAuthTokens()
      queryClient.removeQueries({ queryKey: ['auth'] })
    }
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.error?.code === 'UNAUTHORIZED') {
        return false
      }
      return failureCount < 3
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthTokens()
      queryClient.clear()
    },
    onError: () => {
      // Clear tokens even if logout fails
      clearAuthTokens()
      queryClient.clear()
    }
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  })
}