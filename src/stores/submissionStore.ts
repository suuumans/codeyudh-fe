import { Store } from '@tanstack/store'
import type { Submission } from '@/types'

export interface SubmissionState {
  submissions: Submission[]
  recentSubmissions: Submission[]
  loading: boolean
  filters: {
    status: string
    language: string
    search: string
  }
}

export const submissionStore = new Store<SubmissionState>({
  submissions: [],
  recentSubmissions: [],
  loading: false,
  filters: {
    status: 'all',
    language: 'all',
    search: '',
  },
})

// Actions
export const submissionActions = {
  setSubmissions: (submissions: Submission[]) => {
    submissionStore.setState((state) => ({
      ...state,
      submissions,
      recentSubmissions: submissions.slice(0, 10),
    }))
  },

  addSubmission: (submission: Submission) => {
    submissionStore.setState((state) => ({
      ...state,
      submissions: [submission, ...state.submissions],
      recentSubmissions: [submission, ...state.recentSubmissions].slice(0, 10),
    }))
  },

  setLoading: (loading: boolean) => {
    submissionStore.setState((state) => ({
      ...state,
      loading,
    }))
  },

  setFilters: (filters: Partial<SubmissionState['filters']>) => {
    submissionStore.setState((state) => ({
      ...state,
      filters: { ...state.filters, ...filters },
    }))
  },

  clearFilters: () => {
    submissionStore.setState((state) => ({
      ...state,
      filters: {
        status: 'all',
        language: 'all',
        search: '',
      },
    }))
  },
}