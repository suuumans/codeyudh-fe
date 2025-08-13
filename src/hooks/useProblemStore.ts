import { useStore } from '@tanstack/react-store'
import { problemStore, problemActions } from '@/stores/problemStore'
import { useMemo } from 'react'
import type { Problem } from '@/types'

export function useProblemStore() {
  return useStore(problemStore)
}

export function useProblems() {
  const { problems, loading, error } = useStore(problemStore)
  
  return {
    problems,
    loading,
    error,
    setProblems: problemActions.setProblems,
    setLoading: problemActions.setLoading,
    setError: problemActions.setError,
  }
}

export function useCurrentProblem() {
  const { currentProblem } = useStore(problemStore)
  
  return {
    problem: currentProblem,
    setProblem: problemActions.setCurrentProblem,
  }
}

export function useProblemFilters() {
  const { filters, searchQuery, problems } = useStore(problemStore)
  
  const filteredProblems = useMemo(() => {
    return problems.filter((problem: Problem) => {
      // Search filter
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Difficulty filter
      const matchesDifficulty = filters.difficulty === 'all' || problem.difficulty === filters.difficulty
      
      // Topic filter
      const matchesTopic = filters.topic === 'all' || (problem.topics && problem.topics.includes(filters.topic))
      
      // Status filter (would need user progress data)
      const matchesStatus = filters.status === 'all' // TODO: implement with user progress
      
      return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus
    })
  }, [problems, filters, searchQuery])
  
  return {
    filters,
    searchQuery,
    filteredProblems,
    setFilters: problemActions.setFilters,
    setSearchQuery: problemActions.setSearchQuery,
    clearFilters: problemActions.clearFilters,
  }
}

export function useCodeEditor() {
  const { codeEditor } = useStore(problemStore)
  
  return {
    ...codeEditor,
    setCode: problemActions.setCode,
    setLanguage: problemActions.setLanguage,
    setTestResults: problemActions.setTestResults,
    setExecutionStats: problemActions.setExecutionStats,
    setError: problemActions.setCodeError,
    setRunning: problemActions.setRunning,
    setSubmitting: problemActions.setSubmitting,
    reset: problemActions.resetCodeEditor,
  }
}