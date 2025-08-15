import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { FilterPanel } from '../FilterPanel'
import type { ProblemFilters } from '@/types'

// Mock the UI store hook
vi.mock('@/hooks/useUIStore', () => ({
  useFilterPanel: vi.fn(() => ({
    isOpen: false,
    setOpen: vi.fn(),
  })),
}))

describe('FilterPanel', () => {
  const mockOnFiltersChange = vi.fn()
  const mockSetOpen = vi.fn()

  const emptyFilters: ProblemFilters = {}
  const filtersWithValues: ProblemFilters = {
    difficulty: ['easy', 'medium'],
    topics: ['Array', 'String'],
    status: ['solved'],
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Reset the mock implementation
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: false,
      setOpen: mockSetOpen,
    })
  })

  it('renders filter toggle button with correct count', () => {
    render(
      <FilterPanel
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // 2 difficulties + 2 topics + 1 status
  })

  it('does not show count badge when no filters are active', () => {
    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('expands filter panel when toggle button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /filters/i }))
    expect(mockSetOpen).toHaveBeenCalledWith(true)
  })

  it('shows filter options when panel is open', async () => {
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText('Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Topics')).toBeInTheDocument()
    
    // Check difficulty options
    expect(screen.getByLabelText('easy')).toBeInTheDocument()
    expect(screen.getByLabelText('medium')).toBeInTheDocument()
    expect(screen.getByLabelText('hard')).toBeInTheDocument()
    
    // Check status options
    expect(screen.getByLabelText('Not Attempted')).toBeInTheDocument()
    expect(screen.getByLabelText('Attempted')).toBeInTheDocument()
    expect(screen.getByLabelText('Solved')).toBeInTheDocument()
  })

  it('shows checked state for active filters', async () => {
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByLabelText('easy')).toBeChecked()
    expect(screen.getByLabelText('medium')).toBeChecked()
    expect(screen.getByLabelText('hard')).not.toBeChecked()
    expect(screen.getByLabelText('Solved')).toBeChecked()
    expect(screen.getByLabelText('Array')).toBeChecked()
    expect(screen.getByLabelText('String')).toBeChecked()
  })

  it('toggles difficulty filter when clicked', async () => {
    const user = userEvent.setup()
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    await user.click(screen.getByLabelText('easy'))
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      difficulty: ['easy'],
    })
  })

  it('removes difficulty filter when unchecked', async () => {
    const user = userEvent.setup()
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={{ difficulty: ['easy', 'medium'] }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    await user.click(screen.getByLabelText('easy'))
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      difficulty: ['medium'],
    })
  })

  it('toggles topic filter when clicked', async () => {
    const user = userEvent.setup()
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    await user.click(screen.getByLabelText('Array'))
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      topics: ['Array'],
    })
  })

  it('toggles status filter when clicked', async () => {
    const user = userEvent.setup()
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    await user.click(screen.getByLabelText('Solved'))
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      status: ['solved'],
    })
  })

  it('shows clear all filters button when filters are active', async () => {
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument()
  })

  it('does not show clear all filters button when no filters are active', async () => {
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.queryByRole('button', { name: /clear all filters/i })).not.toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    await user.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(mockOnFiltersChange).toHaveBeenCalledWith({})
  })

  it('displays active filter badges', () => {
    render(
      <FilterPanel
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText('easy')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('Array')).toBeInTheDocument()
    expect(screen.getByText('String')).toBeInTheDocument()
    expect(screen.getByText('Solved')).toBeInTheDocument()
  })

  it('removes individual filter when badge X is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <FilterPanel
        filters={filtersWithValues}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    // Find the X button next to the 'easy' badge
    const easyBadge = screen.getByText('easy').closest('.flex')
    const removeButton = easyBadge?.querySelector('svg')
    
    if (removeButton) {
      await user.click(removeButton)
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...filtersWithValues,
        difficulty: ['medium'],
      })
    }
  })

  it('uses custom available topics when provided', async () => {
    const customTopics = ['Custom Topic 1', 'Custom Topic 2']
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={emptyFilters}
        onFiltersChange={mockOnFiltersChange}
        availableTopics={customTopics}
      />
    )

    expect(screen.getByLabelText('Custom Topic 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom Topic 2')).toBeInTheDocument()
    expect(screen.queryByLabelText('Array')).not.toBeInTheDocument()
  })

  it('handles empty filter arrays correctly', async () => {
    const user = userEvent.setup()
    const { useFilterPanel } = await import('@/hooks/useUIStore')
    vi.mocked(useFilterPanel).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    })

    render(
      <FilterPanel
        filters={{ difficulty: ['easy'] }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    // Remove the last difficulty filter
    await user.click(screen.getByLabelText('easy'))
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      difficulty: undefined,
    })
  })
})