import { describe, it, expect } from 'vitest'

describe('Simple Test', () => {
  it('should perform basic math', () => {
    expect(1 + 1).toBe(2)
  })

  it('should work with strings', () => {
    expect('hello world').toContain('world')
  })

  it('should work with arrays', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })
})