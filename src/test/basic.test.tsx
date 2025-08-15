import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple component for testing
const TestComponent = ({ message }: { message: string }) => (
  <div>{message}</div>
)

describe('Basic Test Setup', () => {
  it('should render a simple component', () => {
    render(<TestComponent message="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect('hello').toBe('hello')
    expect([1, 2, 3]).toHaveLength(3)
  })
})