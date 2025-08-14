import api from '@/lib/api'
import type { User, UserStatistics, Submission, ApiResponse, PaginatedResponse } from '@/types'

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/users/me')
    return response.data.data
  },

  getUserStatistics: async (userId: string): Promise<UserStatistics> => {
    const response = await api.get<ApiResponse<UserStatistics>>(`/users/${userId}/statistics`)
    return response.data.data
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}`, data)
    return response.data.data
  },

  getUserSubmissions: async (
    userId: string, 
    options?: {
      page?: number
      limit?: number
      status?: string
      language?: string
    }
  ): Promise<PaginatedResponse<Submission>> => {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.status) params.append('status', options.status)
    if (options?.language) params.append('language', options.language)

    const response = await api.get<PaginatedResponse<Submission>>(
      `/users/${userId}/submissions?${params.toString()}`
    )
    return response.data
  },

  getSubmissionById: async (submissionId: string): Promise<Submission> => {
    const response = await api.get<ApiResponse<Submission>>(`/submissions/${submissionId}`)
    return response.data.data
  },
}