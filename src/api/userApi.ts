import type { User, UserStatistics, Submission } from '@/types'

// Mock API functions - replace with actual API calls
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id: 'user-1',
      username: 'codeyudh_user',
      email: 'user@example.com',
      avatar: '',
      createdAt: new Date('2025-01-01'),
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

  getUserStatistics: async (_userId: string): Promise<UserStatistics> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalSolved: 42,
      easySolved: 20,
      mediumSolved: 15,
      hardSolved: 7,
      currentStreak: 12,
      maxStreak: 25,
      acceptanceRate: 73.5,
      ranking: 1247,
    }
  },

  updateUserProfile: async (_userId: string, data: Partial<User>): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return updated user
    const currentUser = await userApi.getCurrentUser()
    return {
      ...currentUser,
      ...data,
      updatedAt: new Date(),
    }
  },

  getUserSubmissions: async (userId: string): Promise<Submission[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return [
      {
        id: '1',
        userId,
        problemId: 'two-sum',
        code: 'function twoSum(nums, target) { /* ... */ }',
        language: 'javascript',
        status: 'accepted',
        executionTime: 68,
        memoryUsage: 42.1,
        testResults: [],
        submittedAt: new Date('2025-08-13T10:30:00Z'),
      },
      {
        id: '2',
        userId,
        problemId: 'add-two-numbers',
        code: 'function addTwoNumbers(l1, l2) { /* ... */ }',
        language: 'javascript',
        status: 'wrong_answer',
        executionTime: 45,
        memoryUsage: 38.7,
        testResults: [],
        submittedAt: new Date('2025-08-12T15:45:00Z'),
      },
      {
        id: '3',
        userId,
        problemId: 'longest-substring',
        code: 'def lengthOfLongestSubstring(s): # ...',
        language: 'python',
        status: 'accepted',
        executionTime: 92,
        memoryUsage: 51.2,
        testResults: [],
        submittedAt: new Date('2025-08-11T09:15:00Z'),
      },
      {
        id: '4',
        userId,
        problemId: 'median-arrays',
        code: 'class Solution { public double findMedianSortedArrays(...) }',
        language: 'java',
        status: 'time_limit_exceeded',
        testResults: [],
        submittedAt: new Date('2025-08-10T14:20:00Z'),
      },
      {
        id: '5',
        userId,
        problemId: 'reverse-integer',
        code: '#include <iostream>\nint reverse(int x) { /* ... */ }',
        language: 'cpp',
        status: 'accepted',
        executionTime: 12,
        memoryUsage: 28.4,
        testResults: [],
        submittedAt: new Date('2025-08-09T11:30:00Z'),
      },
    ]
  },
}