import api from '@/lib/api'
import type { User, LoginCredentials, RegisterData, AuthTokens, ApiResponse } from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', credentials)
    return response.data.data
  },

  register: async (userData: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', userData)
    return response.data.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken })
    return response.data.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password })
  },
}