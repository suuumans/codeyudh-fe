import { useStore } from '@tanstack/react-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userStore, userActions } from '@/stores/userStore'
// Removed unused import
import { userApi } from '@/api/userApi'
import type { User } from '@/types'

export function useUserStore() {
  return useStore(userStore)
}

export function useUserStatistics() {
  const { currentUser } = useStore(userStore)
  
  return useQuery({
    queryKey: ['user', 'statistics', currentUser?.id],
    queryFn: () => userApi.getUserStatistics(currentUser!.id),
    enabled: !!currentUser?.id,
  })
}

export function useUserSubmissions() {
  const { currentUser } = useStore(userStore)
  
  return useQuery({
    queryKey: ['user', 'submissions', currentUser?.id],
    queryFn: () => userApi.getUserSubmissions(currentUser!.id),
    enabled: !!currentUser?.id,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { currentUser } = useStore(userStore)
  
  return useMutation({
    mutationFn: (data: Partial<User>) => 
      userApi.updateUserProfile(currentUser!.id, data),
    onMutate: async (updatedData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['auth', 'user'] })
      await queryClient.cancelQueries({ queryKey: ['user', currentUser?.id] })
      
      // Snapshot the previous values
      const previousUser = queryClient.getQueryData(['auth', 'user'])
      const previousUserData = queryClient.getQueryData(['user', currentUser?.id])
      
      // Optimistically update the user data
      const optimisticUser = { ...currentUser, ...updatedData }
      queryClient.setQueryData(['auth', 'user'], optimisticUser)
      queryClient.setQueryData(['user', currentUser?.id], optimisticUser)
      if (optimisticUser.id) {
        userActions.setUser(optimisticUser as User)
      }
      
      // Return a context object with the snapshotted values
      return { previousUser, previousUserData, userId: currentUser?.id }
    },
    onSuccess: (updatedUser) => {
      // Update with the actual response from server
      queryClient.setQueryData(['auth', 'user'], updatedUser)
      queryClient.setQueryData(['user', updatedUser.id], updatedUser)
      userActions.setUser(updatedUser)
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousUser) {
        queryClient.setQueryData(['auth', 'user'], context.previousUser)
        userActions.setUser(context.previousUser as User)
      }
      if (context?.previousUserData && context?.userId) {
        queryClient.setQueryData(['user', context.userId], context.previousUserData)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
  })
}