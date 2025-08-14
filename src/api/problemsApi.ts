import api from '@/lib/api'
import type { 
  Problem, 
  ProblemFilters, 
  ApiResponse, 
  PaginatedResponse,
  UserProblemProgress 
} from '@/types'

export const problemsApi = {
  getProblems: async (
    filters?: ProblemFilters & {
      page?: number
      limit?: number
    }
  ): Promise<PaginatedResponse<Problem>> => {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    
    if (filters?.difficulty?.length) {
      filters.difficulty.forEach(d => params.append('difficulty', d))
    }
    
    if (filters?.topics?.length) {
      filters.topics.forEach(t => params.append('topics', t))
    }
    
    if (filters?.status?.length) {
      filters.status.forEach(s => params.append('status', s))
    }

    const response = await api.get<PaginatedResponse<Problem>>(
      `/problems?${params.toString()}`
    )
    return response.data
  },

  getProblemById: async (problemId: string): Promise<Problem> => {
    const response = await api.get<ApiResponse<Problem>>(`/problems/${problemId}`)
    return response.data.data
  },

  getUserProblemProgress: async (problemId: string): Promise<UserProblemProgress | null> => {
    try {
      const response = await api.get<ApiResponse<UserProblemProgress>>(
        `/problems/${problemId}/progress`
      )
      return response.data.data
    } catch (error) {
      // Return null if no progress found (404)
      return null
    }
  },

  getTopics: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/problems/topics')
    return response.data.data
  },

  getProblemHints: async (problemId: string): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>(`/problems/${problemId}/hints`)
    return response.data.data
  },

  getProblemSolutions: async (problemId: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/problems/${problemId}/solutions`)
    return response.data.data
  },

  toggleProblemFavorite: async (problemId: string, isFavorite: boolean): Promise<void> => {
    await api.post(`/problems/${problemId}/favorite`, { isFavorite })
  },
}