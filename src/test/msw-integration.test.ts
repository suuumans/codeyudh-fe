import { describe, it, expect } from 'vitest'

describe('MSW Integration Test', () => {
  const baseURL = 'http://localhost:3000'

  it('should mock API calls successfully', async () => {
    // Test that MSW is properly set up by making a fetch request
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    })

    expect(response.ok).toBe(true)
    
    const data = await response.json()
    expect(data).toHaveProperty('user')
    expect(data).toHaveProperty('token')
    expect(data.user.email).toBe('test@example.com')
  })

  it('should handle error responses', async () => {
    const response = await fetch(`${baseURL}/api/auth/login-error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      }),
    })

    expect(response.status).toBe(401)
    
    const data = await response.json()
    expect(data).toHaveProperty('error')
    expect(data.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('should mock problems API', async () => {
    const response = await fetch(`${baseURL}/api/problems`)
    
    expect(response.ok).toBe(true)
    
    const data = await response.json()
    expect(data).toHaveProperty('problems')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.problems)).toBe(true)
  })
})