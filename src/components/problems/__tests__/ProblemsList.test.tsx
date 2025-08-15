import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { ProblemsList } from '../ProblemsList'
import { mockProblem } from '@/test/mocks'
import type { Problem, ProblemFilters } from '@/types'

// Mock the UI store hook
vi.mock('@/hooks/useUIStore', () => ({
  useProblemsViewMode: vi.fn(() => ({
    viewMode: 'grid',
    setViewMode: vi.fn(),
  })),
}))

describe('ProblemsList', () => {
  const mockFilters: ProblemFilters = {
    difficulty: [],
    topics: [],
    status: 'all',
    search: '',
  }

  const mockOnFilterChange = vi.fn()
  const mockRetry = vi.fn()
  const mockSetViewMode = vi.fn()

  const multipleProblems: Problem[] = [
    mockProblem,
    {
      ...mockProblem,
      id: '2',
      title: 'Three Sum',
      difficulty: 'medium',
      topics: ['Array', 'Two Pointers'],
    },
    {
      ...mockProblem,
      id: '3',
      title: 'Median of Two Sorted Arrays',
      difficulty: 'hard',
      topics: ['Array', 'Binary Search'],
    },
  ]

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Reset the mock implementation
    const { useProblemsViewMode } = await import('@/hooks/useUIStore')
    vi.mocked(useProblemsViewMode).mockReturnValue({
      viewMode: 'grid',
      setViewMode: mockSetViewMode,
    })
  })

  it('renders problems list correctly', () => {
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    expect(screen.getByText('3 problems found')).toBeInTheDocument()
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
    expect(screen.getByText('Three Sum')).toBeInTheDocument()
    expect(screen.getByText('Median of Two Sorted Arrays')).toBeInTheDocument()
  })

  it('shows loading state correctly', () => {
    render(
      <ProblemsList
        problems={[]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={true}
      />
    )

    // Should show skeleton loading
    expect(screen.queryByText('problems found')).not.toBeInTheDocument()
  })

  it('shows error state with retry button', () => {
    const error = 'Failed to load problems'
    render(
      <ProblemsList
        problems={[]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
        error={error}
        retry={mockRetry}
      />
    )

    expect(screen.getByText(/failed to load problems/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('calls retry function when retry button is clicked', async () => {
    const user = userEvent.setup()
    const error = 'Network error'
    
    render(
      <ProblemsList
        problems={[]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
        error={error}
        retry={mockRetry}
      />
    )

    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(mockRetry).toHaveBeenCalled()
  })

  it('shows empty state when no problems found', () => {
    render(
      <ProblemsList
        problems={[]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    expect(screen.getByText(/no problems found/i)).toBeInTheDocument()
    expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('shows correct problem count for single problem', () => {
    render(
      <ProblemsList
        problems={[mockProblem]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    expect(screen.getByText('1 problem found')).toBeInTheDocument()
  })

  it('shows correct problem count for multiple problems', () => {
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    expect(screen.getByText('3 problems found')).toBeInTheDocument()
  })

  it('displays view mode toggle buttons', () => {
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    const gridButton = screen.getByRole('button', { name: '' }) // Grid icon button
    const listButton = screen.getAllByRole('button', { name: '' })[1] // List icon button
    
    expect(gridButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
  })

  it('highlights active view mode correctly', () => {
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    const buttons = screen.getAllByRole('button', { name: '' })
    const gridButton = buttons.find(btn => btn.querySelector('svg'))
    
    // Grid should be active (default variant)
    expect(gridButton).not.toHaveClass('variant-ghost')
  })

  it('switches to list view when list button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    const buttons = screen.getAllByRole('button', { name: '' })
    const listButton = buttons[1] // Second button should be list view
    
    await user.click(listButton)
    expect(mockSetViewMode).toHaveBeenCalledWith('list')
  })

  it('switches to grid view when grid button is clicked', async () => {
    const user = userEvent.setup()
    
    // Mock list view as current
    const { useProblemsViewMode } = await import('@/hooks/useUIStore')
    vi.mocked(useProblemsViewMode).mockReturnValue({
      viewMode: 'list',
      setViewMode: mockSetViewMode,
    })
    
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    const buttons = screen.getAllByRole('button', { name: '' })
    const gridButton = buttons[0] // First button should be grid view
    
    await user.click(gridButton)
    expect(mockSetViewMode).toHaveBeenCalledWith('grid')
  })

  it('applies correct grid layout classes for grid view', () => {
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    const problemsContainer = screen.getByText('Two Sum').closest('.grid')
    expect(problemsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('applies correct grid layout classes for list view', async () => {
    // Mock list view
    const { useProblemsViewMode } = await import('@/hooks/useUIStore')
    vi.mocked(useProblemsViewMode).mockReturnValue({
      viewMode: 'list',
      setViewMode: mockSetViewMode,
    })
    
    render(
      <ProblemsList
        problems={multipleProblems}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    const problemsContainer = screen.getByText('Two Sum').closest('.grid')
    expect(problemsContainer).toHaveClass('grid-cols-1')
    expect(problemsContainer).not.toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('handles error objects correctly', () => {
    const error = new Error('Network connection failed')
    
    render(
      <ProblemsList
        problems={[]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
        error={error}
        retry={mockRetry}
      />
    )

    expect(screen.getByText(/network connection failed/i)).toBeInTheDocument()
  })

  it('logs problem navigation when problem is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()
    
    render(
      <ProblemsList
        problems={[mockProblem]}
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        loading={false}
      />
    )

    await user.click(screen.getByText('Two Sum'))
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to problem:', mockProblem.id)
    
    consoleSpy.mockRestore()
  })
})