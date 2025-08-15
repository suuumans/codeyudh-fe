import { describe, it, expect } from 'vitest'

describe('Testing Infrastructure', () => {
  it('should have vitest working correctly', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
    expect('hello').toContain('ell')
  })

  it('should have async/await support', async () => {
    const promise = Promise.resolve('test')
    const result = await promise
    expect(result).toBe('test')
  })

  it('should have mock functions working', () => {
    const mockFn = vi.fn()
    mockFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should have proper test environment', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
    expect(typeof global).toBe('object')
  })
})