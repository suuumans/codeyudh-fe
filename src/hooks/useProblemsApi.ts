import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { problemsApi } from '@/api/problemsApi'
import type { ProblemFilters } from '@/types'

export const useProblems = (
  filters?: ProblemFilters & {
    page?: number
    limit?: number
  }
) => {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: () => problemsApi.getProblems(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  })
}

export const useInfiniteProblems = (
  filters?: ProblemFilters & {
    limit?: number
  }
) => {
  return useInfiniteQuery({
    queryKey: ['problems', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      problemsApi.getProblems({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useProblem = (problemId: string) => {
  return useQuery({
    queryKey: ['problems', problemId],
    queryFn: () => problemsApi.getProblemById(problemId),
    staleTime: 10 * 60 * 1000, // 10 minutes - problems don't change often
    enabled: !!problemId,
  })
}

export const useProblemProgress = (problemId: string) => {
  return useQuery({
    queryKey: ['problems', problemId, 'progress'],
    queryFn: () => problemsApi.getUserProblemProgress(problemId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!problemId,
  })
}

export const useTopics = () => {
  return useQuery({
    queryKey: ['problems', 'topics'],
    queryFn: problemsApi.getTopics,
    staleTime: 30 * 60 * 1000, // 30 minutes - topics rarely change
  })
}

export const useProblemHints = (problemId: string) => {
  return useQuery({
    queryKey: ['problems', problemId, 'hints'],
    queryFn: () => problemsApi.getProblemHints(problemId),
    staleTime: 10 * 60 * 1000,
    enabled: !!problemId,
  })
}

export const useProblemSolutions = (problemId: string) => {
  return useQuery({
    queryKey: ['problems', problemId, 'solutions'],
    queryFn: () => problemsApi.getProblemSolutions(problemId),
    staleTime: 10 * 60 * 1000,
    enabled: !!problemId,
  })
}

export const useToggleProblemFavorite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ problemId, isFavorite }: { problemId: string; isFavorite: boolean }) =>
      problemsApi.toggleProblemFavorite(problemId, isFavorite),
    onMutate: async ({ problemId, isFavorite }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['problems', problemId] })
      await queryClient.cancelQueries({ queryKey: ['problems', problemId, 'progress'] })
      
      // Snapshot the previous values
      const previousProblem = queryClient.getQueryData(['problems', problemId])
      const previousProgress = queryClient.getQueryData(['problems', problemId, 'progress'])
      
      // Optimistically update the favorite status
      queryClient.setQueryData(['problems', problemId], (old: any) => ({
        ...old,
        isFavorite,
      }))
      
      queryClient.setQueryData(['problems', problemId, 'progress'], (old: any) => ({
        ...old,
        isFavorite,
      }))
      
      // Return a context object with the snapshotted values
      return { previousProblem, previousProgress, problemId }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProblem) {
        queryClient.setQueryData(['problems', context.problemId], context.previousProblem)
      }
      if (context?.previousProgress) {
        queryClient.setQueryData(['problems', context.problemId, 'progress'], context.previousProgress)
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['problems', variables.problemId] })
      queryClient.invalidateQueries({ queryKey: ['problems', variables.problemId, 'progress'] })
    },
  })
}