import type { User, LoginCredentials, RegisterData } from '@/types'

// Mock API functions (these would be replaced with actual API calls)
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: '1',
          username: 'testuser',
          email: credentials.email,
          avatar: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          statistics: {
            totalSolved: 42,
            easySolved: 20,
            mediumSolved: 15,
            hardSolved: 7,
            currentStreak: 12,
            maxStreak: 25,
            acceptanceRate: 73.5,
            ranking: 1247,
          },
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      }
    }
    throw new Error('Invalid credentials')
  },

  register: async (userData: RegisterData): Promise<{ user: User; token: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    return {
      user: {
        id: '2',
        username: userData.username,
        email: userData.email,
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        statistics: {
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          currentStreak: 0,
          maxStreak: 0,
          acceptanceRate: 0,
          ranking: 0,
        },
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // Simulate API call to get current user from token
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      avatar: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      statistics: {
        totalSolved: 42,
        easySolved: 20,
        mediumSolved: 15,
        hardSolved: 7,
        currentStreak: 12,
        maxStreak: 25,
        acceptanceRate: 73.5,
        ranking: 1247,
      },
    }
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!refreshToken) {
      throw new Error('No refresh token provided')
    }
    
    return {
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token',
    }
  },
}