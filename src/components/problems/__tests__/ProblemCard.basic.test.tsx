import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { ProblemCard } from '../ProblemCard'
import { mockProblem } from '@/test/mocks'

describe('ProblemCard Basic Tests', () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders problem information correctly', () => {
    render(
      <ProblemCard 
        problem={mockProblem} 
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText(mockProblem.title)).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByText('Array')).toBeInTheDocument()
    expect(screen.getByText('Hash Table')).toBeInTheDocument()
    expect(screen.getByText('50.0%')).toBeInTheDocument()
    expect(screen.getByText('1,000 submissions')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ProblemCard 
        problem={mockProblem} 
        onClick={mockOnClick}
      />
    )

    await user.click(screen.getByRole('button'))
    expect(mockOnClick).toHaveBeenCalledWith(mockProblem.id)
  })

  it('displays correct difficulty colors', () => {
    render(
      <ProblemCard 
        problem={mockProblem} 
        onClick={mockOnClick}
      />
    )

    const difficultyBadge = screen.getByText('Easy')
    expect(difficultyBadge).toHaveClass('bg-green-100')
  })

  it('shows solved status when provided', () => {
    render(
      <ProblemCard 
        problem={mockProblem} 
        userProgress={{ status: 'solved', attempts: 3 }}
        onClick={mockOnClick}
      />
    )

    const statusIcon = screen.getByRole('button').querySelector('svg')
    expect(statusIcon).toHaveClass('text-green-600')
  })

  it('formats large numbers correctly', () => {
    const problemWithManySubmissions = {
      ...mockProblem,
      totalSubmissions: 1234567
    }
    
    render(
      <ProblemCard 
        problem={problemWithManySubmissions} 
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('1,234,567 submissions')).toBeInTheDocument()
  })
})