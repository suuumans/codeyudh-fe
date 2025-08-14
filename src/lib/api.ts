import axios, { AxiosError, type AxiosResponse } from 'axios'
import { getAuthTokens, setAuthTokens, clearAuthTokens } from './auth-storage'
import type { ApiError, AuthTokens } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track if we're currently refreshing token to avoid multiple refresh calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

// Add request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const tokens = getAuthTokens()
    if (tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const tokens = getAuthTokens()
      if (tokens?.refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken: tokens.refreshToken
          })
          
          const newTokens: AuthTokens = response.data
          setAuthTokens(newTokens)
          
          processQueue(null, newTokens.accessToken)
          
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          clearAuthTokens()
          // Redirect to login or emit event for app to handle
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        clearAuthTokens()
        window.location.href = '/login'
      }
    }

    // Transform error to our standard format
    const apiError: ApiError = {
      error: {
        code: (error.response?.data as any)?.error?.code || 'UNKNOWN_ERROR',
        message: (error.response?.data as any)?.error?.message || error.message || 'An unexpected error occurred',
        details: (error.response?.data as any)?.error?.details
      },
      timestamp: new Date().toISOString(),
      path: error.config?.url || ''
    }

    return Promise.reject(apiError)
  }
)

export default api
