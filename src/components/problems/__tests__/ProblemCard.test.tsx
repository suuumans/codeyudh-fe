import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { ProblemCard } from '../ProblemCard'
import { mockProblem } from '@/test/mocks'

describe('ProblemCard', () => {
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

  it('displays correct difficulty badge color for easy problems', () => {
    const easyProblem = { ...mockProblem, difficulty: 'easy' as const }
    render(
      <ProblemCard 
        problem={easyProblem} 
        onClick={mockOnClick}
      />
    )

    const difficultyBadge = screen.getByText('Easy')
    expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('displays correct difficulty badge color for medium problems', () => {
    const mediumProblem = { ...mockProblem, difficulty: 'medium' as const }
    render(
      <ProblemCard 
        problem={mediumProblem} 
        onClick={mockOnClick}
      />
    )

    const difficultyBadge = screen.getByText('Medium')
    expect(difficultyBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('displays correct difficulty badge color for hard problems', () => {
    const hardProblem = { ...mockProblem, difficulty: 'hard' as const }
    render(
      <ProblemCard 
        problem={hardProblem} 
        onClick={mockOnClick}
      />
    )

    const difficultyBadge = screen.getByText('Hard')
    expect(difficultyBadge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('shows only first 2 topics and indicates more if there are additional topics', () => {
    const problemWithManyTopics = {
      ...mockProblem,
      topics: ['Array', 'Hash Table', 'Two Pointers', 'Sorting', 'Binary Search']
    }
    
    render(
      <ProblemCard 
        problem={problemWithManyTopics} 
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Array')).toBeInTheDocument()
    expect(screen.getByText('Hash Table')).toBeInTheDocument()
    expect(screen.getByText('+3 more')).toBeInTheDocument()
    expect(screen.queryByText('Two Pointers')).not.toBeInTheDocument()
  })

  it('displays not attempted status by default', () => {
    render(
      <ProblemCard 
        problem={mockProblem} 
        onClick={mockOnClick}
      />
    )

    // Check for Circle icon (not attempted)
    const statusIcon = screen.getByRole('button').querySelector('svg')
    expect(statusIcon).toHaveClass('text-gray-400')
  })

  it('displays solved status correctly', () => {
    render(
      <ProblemCard 
        problem={mockProblem} 
        userProgress={{ status: 'solved', attempts: 3 }}
        onClick={mockOnClick}
      />
    )

    // Check for CheckCircle icon (solved)
    const statusIcon = screen.getByRole('button').querySelector('svg')
    expect(statusIcon).toHaveClass('text-green-600')
  })

  it('displays attempted status correctly', () => {
    render(
      <ProblemCard 
        problem={mockProblem} 
        userProgress={{ status: 'attempted', attempts: 2 }}
        onClick={mockOnClick}
      />
    )

    // Check for Clock icon (attempted)
    const statusIcon = screen.getByRole('button').querySelector('svg')
    expect(statusIcon).toHaveClass('text-yellow-600')
  })

  it('calls onClick with problem id when clicked', async () => {
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

  it('displays acceptance rate as progress bar', () => {
    const problemWithHighAcceptance = {
      ...mockProblem,
      acceptanceRate: 75.5
    }
    
    render(
      <ProblemCard 
        problem={problemWithHighAcceptance} 
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('75.5%')).toBeInTheDocument()
    expect(screen.getByText('Acceptance Rate')).toBeInTheDocument()
  })

  it('formats large submission numbers correctly', () => {
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

  it('handles problems with no topics', () => {
    const problemWithNoTopics = {
      ...mockProblem,
      topics: []
    }
    
    render(
      <ProblemCard 
        problem={problemWithNoTopics} 
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText(problemWithNoTopics.title)).toBeInTheDocument()
    expect(screen.queryByText('Array')).not.toBeInTheDocument()
  })

  it('handles long problem titles correctly', () => {
    const problemWithLongTitle = {
      ...mockProblem,
      title: 'This is a very long problem title that should be truncated properly to avoid layout issues'
    }
    
    render(
      <ProblemCard 
        problem={problemWithLongTitle} 
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText(problemWithLongTitle.title)).toBeInTheDocument()
    // The title should have line-clamp-2 class for truncation
    const titleElement = screen.getByText(problemWithLongTitle.title)
    expect(titleElement).toHaveClass('line-clamp-2')
  })
})