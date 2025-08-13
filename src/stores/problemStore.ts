import { Store } from '@tanstack/store'
import type { Problem } from '@/types'

export interface ProblemState {
  // Problem data
  problems: Problem[]
  currentProblem: Problem | null
  loading: boolean
  error: string | null
  
  // Filters and search
  filters: {
    difficulty: string
    topic: string
    status: string
  }
  searchQuery: string
  
  // Code editor state
  codeEditor: {
    code: string
    language: string
    testResults: any[] | null
    executionStats: {
      runtime: number
      memory: number
      runtimePercentile?: number
      memoryPercentile?: number
    } | null
    error: string | null
    isRunning: boolean
    isSubmitting: boolean
  }
}

export const problemStore = new Store<ProblemState>({
  problems: [],
  currentProblem: null,
  loading: false,
  error: null,
  filters: {
    difficulty: 'all',
    topic: 'all',
    status: 'all',
  },
  searchQuery: '',
  codeEditor: {
    code: '',
    language: 'javascript',
    testResults: null,
    executionStats: null,
    error: null,
    isRunning: false,
    isSubmitting: false,
  },
})

// Actions
export const problemActions = {
  // Problem data
  setProblems: (problems: Problem[]) => {
    problemStore.setState((state) => ({
      ...state,
      problems,
      loading: false,
      error: null,
    }))
  },
  
  setCurrentProblem: (problem: Problem | null) => {
    problemStore.setState((state) => ({
      ...state,
      currentProblem: problem,
    }))
  },
  
  setLoading: (loading: boolean) => {
    problemStore.setState((state) => ({
      ...state,
      loading,
    }))
  },
  
  setError: (error: string | null) => {
    problemStore.setState((state) => ({
      ...state,
      error,
      loading: false,
    }))
  },
  
  // Filters and search
  setFilters: (filters: Partial<ProblemState['filters']>) => {
    problemStore.setState((state) => ({
      ...state,
      filters: { ...state.filters, ...filters },
    }))
  },
  
  setSearchQuery: (query: string) => {
    problemStore.setState((state) => ({
      ...state,
      searchQuery: query,
    }))
  },
  
  clearFilters: () => {
    problemStore.setState((state) => ({
      ...state,
      filters: {
        difficulty: 'all',
        topic: 'all',
        status: 'all',
      },
      searchQuery: '',
    }))
  },
  
  // Code editor
  setCode: (code: string) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, code },
    }))
  },
  
  setLanguage: (language: string) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, language },
    }))
  },
  
  setTestResults: (results: any[] | null) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, testResults: results },
    }))
  },
  
  setExecutionStats: (stats: ProblemState['codeEditor']['executionStats']) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, executionStats: stats },
    }))
  },
  
  setCodeError: (error: string | null) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, error },
    }))
  },
  
  setRunning: (isRunning: boolean) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, isRunning },
    }))
  },
  
  setSubmitting: (isSubmitting: boolean) => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: { ...state.codeEditor, isSubmitting },
    }))
  },
  
  // Reset code editor state when switching problems
  resetCodeEditor: (initialCode = '', initialLanguage = 'javascript') => {
    problemStore.setState((state) => ({
      ...state,
      codeEditor: {
        code: initialCode,
        language: initialLanguage,
        testResults: null,
        executionStats: null,
        error: null,
        isRunning: false,
        isSubmitting: false,
      },
    }))
  },
}