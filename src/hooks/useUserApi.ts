import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/userApi'
import { setUserData } from '@/lib/auth-storage'
import type { User } from '@/types'

export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['user', 'profile', userId],
    queryFn: () => userApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  })
}

export const useUserStatistics = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'statistics'],
    queryFn: () => userApi.getUserStatistics(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!userId,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      userApi.updateUserProfile(userId, data),
    onMutate: async ({ userId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', 'profile', userId] })
      await queryClient.cancelQueries({ queryKey: ['auth', 'user'] })
      
      // Snapshot the previous values
      const previousProfile = queryClient.getQueryData(['user', 'profile', userId])
      const previousAuthUser = queryClient.getQueryData(['auth', 'user'])
      
      // Optimistically update the profile
      const optimisticUser = { ...(previousProfile as User), ...data } as User
      queryClient.setQueryData(['user', 'profile', userId], optimisticUser)
      queryClient.setQueryData(['auth', 'user'], optimisticUser)
      
      // Return a context object with the snapshotted values
      return { previousProfile, previousAuthUser, userId }
    },
    onSuccess: (updatedUser) => {
      // Update cached user data with server response
      queryClient.setQueryData(['user', 'profile', updatedUser.id], updatedUser)
      queryClient.setQueryData(['auth', 'user'], updatedUser)
      
      // Update local storage
      setUserData(updatedUser)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProfile) {
        queryClient.setQueryData(['user', 'profile', context.userId], context.previousProfile)
      }
      if (context?.previousAuthUser) {
        queryClient.setQueryData(['auth', 'user'], context.previousAuthUser)
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
  })
}

export const useUserSubmissions = (
  userId: string,
  options?: {
    page?: number
    limit?: number
    status?: string
    language?: string
  }
) => {
  return useQuery({
    queryKey: ['user', userId, 'submissions', options],
    queryFn: () => userApi.getUserSubmissions(userId, options),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
  })
}

export const useSubmission = (submissionId: string) => {
  return useQuery({
    queryKey: ['submissions', submissionId],
    queryFn: () => userApi.getSubmissionById(submissionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!submissionId,
  })
}