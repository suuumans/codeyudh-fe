// MSW API handlers for testing
import { http, HttpResponse } from 'msw'
import { mockUser, mockProblem, mockSubmission } from '../mocks'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: mockUser,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    })
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: mockUser,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token',
    })
  }),

  // Problems endpoints
  http.get('/api/problems', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '1'
    const limit = url.searchParams.get('limit') || '20'
    
    return HttpResponse.json({
      problems: [mockProblem],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1,
        totalPages: 1,
      },
    })
  }),

  http.get('/api/problems/:id', ({ params }) => {
    return HttpResponse.json({
      ...mockProblem,
      id: params.id,
    })
  }),

  http.post('/api/problems/:id/run', () => {
    return HttpResponse.json({
      results: [
        {
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          passed: true,
          executionTime: 100,
          memoryUsage: 1024,
        },
      ],
      stats: {
        executionTime: 100,
        memoryUsage: 1024,
        testsPassed: 1,
        totalTests: 1,
      },
    })
  }),

  http.post('/api/problems/:id/submit', () => {
    return HttpResponse.json({
      submission: mockSubmission,
      results: [
        {
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          passed: true,
          executionTime: 100,
          memoryUsage: 1024,
        },
      ],
      stats: {
        executionTime: 100,
        memoryUsage: 1024,
        testsPassed: 1,
        totalTests: 1,
      },
    })
  }),

  // User endpoints
  http.get('/api/users/profile', () => {
    return HttpResponse.json(mockUser)
  }),

  http.put('/api/users/profile', () => {
    return HttpResponse.json(mockUser)
  }),

  http.get('/api/users/statistics', () => {
    return HttpResponse.json(mockUser.statistics)
  }),

  http.get('/api/users/submissions', () => {
    return HttpResponse.json({
      submissions: [mockSubmission],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    })
  }),

  // Error handlers for testing error scenarios
  http.post('/api/auth/login-error', () => {
    return HttpResponse.json(
      { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
      { status: 401 }
    )
  }),

  http.get('/api/problems-error', () => {
    return HttpResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }),
]