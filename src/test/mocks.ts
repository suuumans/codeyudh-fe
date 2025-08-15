import { vi } from 'vitest'
import type { User, Problem, Submission } from '@/types'

// Mock user data
export const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  statistics: {
    totalSolved: 10,
    easySolved: 5,
    mediumSolved: 3,
    hardSolved: 2,
    currentStreak: 3,
    maxStreak: 5,
    acceptanceRate: 0.8,
    ranking: 100,
  },
}

// Mock problem data
export const mockProblem: Problem = {
  id: '1',
  title: 'Two Sum',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  difficulty: 'easy' as const,
  topics: ['Array', 'Hash Table'],
  constraints: '2 <= nums.length <= 10^4',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
  ],
  testCases: [
    {
      input: '[2,7,11,15]\n9',
      expectedOutput: '[0,1]',
      isHidden: false,
    },
  ],
  acceptanceRate: 0.5,
  totalSubmissions: 1000,
  createdAt: new Date('2024-01-01'),
}

// Mock submission data
export const mockSubmission: Submission = {
  id: '1',
  userId: '1',
  problemId: '1',
  code: 'function twoSum(nums, target) { return [0, 1]; }',
  language: 'javascript',
  status: 'accepted',
  executionTime: 100,
  memoryUsage: 1024,
  testResults: [
    {
      input: '[2,7,11,15]\n9',
      expectedOutput: '[0,1]',
      actualOutput: '[0,1]',
      passed: true,
      executionTime: 100,
      memoryUsage: 1024,
    },
  ],
  submittedAt: new Date('2024-01-01'),
}

// Mock API functions
export const mockAuthApi = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
}

export const mockProblemsApi = {
  getProblems: vi.fn(),
  getProblem: vi.fn(),
  runCode: vi.fn(),
  submitCode: vi.fn(),
}

export const mockUserApi = {
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  getStatistics: vi.fn(),
  getSubmissions: vi.fn(),
}