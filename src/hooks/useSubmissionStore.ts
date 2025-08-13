import { useStore } from '@tanstack/react-store'
import { submissionStore, submissionActions } from '@/stores/submissionStore'
// Types are used in the hook functions
import { useMemo } from 'react'

export function useSubmissionStore() {
  return useStore(submissionStore)
}

export function useFilteredSubmissions() {
  const { submissions, filters } = useStore(submissionStore)
  
  return useMemo(() => {
    return submissions.filter(submission => {
      const matchesSearch = submission.problemId
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || 
        submission.status === filters.status
      
      const matchesLanguage = filters.language === 'all' || 
        submission.language === filters.language
      
      return matchesSearch && matchesStatus && matchesLanguage
    })
  }, [submissions, filters])
}

export function useSubmissionFilters() {
  const setFilters = (filters: Partial<typeof submissionStore.state.filters>) => {
    submissionActions.setFilters(filters)
  }
  
  const clearFilters = () => {
    submissionActions.clearFilters()
  }
  
  return { setFilters, clearFilters }
}