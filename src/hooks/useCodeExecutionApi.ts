import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { codeExecutionApi } from '@/api/codeExecutionApi'
import type { CodeExecutionRequest } from '@/types'

export const useRunCode = () => {
  return useMutation({
    mutationFn: codeExecutionApi.runCode,
    // Don't retry code execution automatically
    retry: false,
  })
}

export const useSubmitCode = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: codeExecutionApi.submitCode,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['problems', variables.problemId, 'progress'] 
      })
      
      // Snapshot the previous value
      const previousProgress = queryClient.getQueryData(['problems', variables.problemId, 'progress'])
      
      // Optimistically update to show submission in progress
      queryClient.setQueryData(
        ['problems', variables.problemId, 'progress'],
        (old: any) => ({
          ...old,
          status: 'attempted',
          lastAttempt: new Date().toISOString(),
          attempts: (old?.attempts || 0) + 1,
        })
      )
      
      // Return a context object with the snapshotted value
      return { previousProgress, problemId: variables.problemId }
    },
    onSuccess: (submission, variables, context) => {
      // Update with actual submission result
      queryClient.setQueryData(
        ['problems', submission.problemId, 'progress'],
        {
          problemId: submission.problemId,
          status: submission.status === 'accepted' ? 'solved' : 'attempted',
          bestSubmission: submission.status === 'accepted' ? submission.id : undefined,
          lastAttempt: submission.submittedAt,
          attempts: context?.previousProgress?.attempts || 1,
        }
      )
      
      // Invalidate related queries for fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['user', 'submissions'] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['user', 'statistics'] 
      })
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProgress) {
        queryClient.setQueryData(
          ['problems', context.problemId, 'progress'],
          context.previousProgress
        )
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: ['problems', variables.problemId, 'progress'] 
      })
    },
    retry: false,
  })
}

export const useSubmissionResult = (submissionId: string, enabled = true) => {
  return useQuery({
    queryKey: ['submissions', submissionId],
    queryFn: () => codeExecutionApi.getSubmissionResult(submissionId),
    enabled: enabled && !!submissionId,
    refetchInterval: (data) => {
      // Keep polling if submission is still pending
      return data?.status === 'pending' ? 2000 : false
    },
    staleTime: 0, // Always refetch for real-time updates
  })
}

export const useSupportedLanguages = () => {
  return useQuery({
    queryKey: ['execution', 'languages'],
    queryFn: codeExecutionApi.getSupportedLanguages,
    staleTime: 60 * 60 * 1000, // 1 hour - languages rarely change
  })
}