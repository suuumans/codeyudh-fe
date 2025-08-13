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
    onSuccess: (updatedUser) => {
      userActions.setUser(updatedUser)
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}