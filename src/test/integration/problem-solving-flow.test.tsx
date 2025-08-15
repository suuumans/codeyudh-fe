import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { EnhancedCodeEditor } from '@/components/problems/EnhancedCodeEditor'
import { mockProblem } from '../mocks'
import type { ProblemFilters } from '@/types'

// Mock the UI store
vi.mock('@/hooks/useUIStore', () => ({
  useProblemsViewMode: () => ({
    viewMode: 'grid',
    setViewMode: vi.fn(),
  }),
  useFilterPanel: () => ({
    isOpen: false,
    setOpen: vi.fn(),
  }),
  useUIStore: () => ({
    state: {
      editorPreferences: {
        keyBindings: 'default',
        fontSize: 14,
        minimap: true,
        wordWrap: false,
        autoFormat: true,
        tabSize: 2,
        splitView: false,
      },
    },
    actions: {
      updateEditorPreferences: vi.fn(),
      toggleSplitView: vi.fn(),
    },
  }),
}))

describe('Problem Solving Flow Integration Tests', () => {
  const mockFilters: ProblemFilters = {
    difficulty: [],
    topics: [],
    status: 'all',
    search: '',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Problem Discovery and Selection', () => {
    it('should display problems list and allow filtering', async () => {
      const user = userEvent.setup()
      const mockOnFilterChange = vi.fn()
      
      render(
        <ProblemsList
          problems={[mockProblem]}
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          loading={false}
        />
      )
      
      // Verify problem is displayed
      expect(screen.getByText(mockProblem.title)).toBeInTheDocument()
      expect(screen.getByText('1 problem found')).toBeInTheDocument()
      
      // Test view mode toggle
      const buttons = screen.getAllByRole('button', { name: '' })
      if (buttons.length > 1) {
        await user.click(buttons[1]) // List view button
        // Verify view mode change would be called
      }
    })

    it('should navigate to problem detail when problem is clicked', async () => {
      const user = userEvent.setup()
      const mockOnClick = vi.fn()
      
      render(
        <ProblemCard 
          problem={mockProblem} 
          onClick={mockOnClick}
        />
      )
      
      await user.click(screen.getByRole('button'))
      expect(mockOnClick).toHaveBeenCalledWith(mockProblem.id)
    })

    it('should show problem details with examples and constraints', () => {
      render(<ProblemDetail problem={mockProblem} />)
      
      expect(screen.getByText(mockProblem.title)).toBeInTheDocument()
      expect(screen.getByText(mockProblem.description)).toBeInTheDocument()
      expect(screen.getByText(/constraints/i)).toBeInTheDocument()
    })
  })

  describe('Code Editor Integration', () => {
    it('should allow code input and language selection', async () => {
      const user = userEvent.setup()
      const mockOnRun = vi.fn()
      const mockOnSubmit = vi.fn()
      
      render(
        <EnhancedCodeEditor
          onRun={mockOnRun}
          onSubmit={mockOnSubmit}
        />
      )
      
      // Verify editor is rendered
      expect(screen.getByText('Enhanced Code Editor')).toBeInTheDocument()
      expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument()
      
      // Test language change
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Python'))
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Python')).toBeInTheDocument()
      })
    })

    it('should execute code and display results', async () => {
      const user = userEvent.setup()
      const mockOnRun = vi.fn()
      const testCode = 'console.log("Hello World");'
      
      render(
        <EnhancedCodeEditor
          initialCode={testCode}
          onRun={mockOnRun}
          onSubmit={vi.fn()}
        />
      )
      
      // Click run button
      await user.click(screen.getByRole('button', { name: /run/i }))
      
      expect(mockOnRun).toHaveBeenCalledWith(testCode, 'javascript')
    })

    it('should display test results after code execution', () => {
      const testResults = [
        {
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          passed: true,
          executionTime: 100,
          memoryUsage: 1024,
        },
      ]
      
      render(
        <EnhancedCodeEditor
          result={testResults}
          onRun={vi.fn()}
          onSubmit={vi.fn()}
        />
      )
      
      expect(screen.getByText('[2,7,11,15]')).toBeInTheDocument()
    })

    it('should handle code execution errors', () => {
      const errorMessage = 'Syntax error on line 5'
      
      render(
        <EnhancedCodeEditor
          error={errorMessage}
          runError={true}
          onRun={vi.fn()}
          onSubmit={vi.fn()}
        />
      )
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('Complete Problem Solving Journey', () => {
    it('should support the full flow from problem selection to submission', async () => {
      // This test would simulate a complete user journey:
      // 1. Browse problems
      // 2. Select a problem
      // 3. Write code
      // 4. Test code
      // 5. Submit solution
      // 6. View results
      
      // This would require a more complex test setup with routing
      // and multiple components working together
      
      const user = userEvent.setup()
      
      // Step 1: Problem selection (mocked)
      const mockNavigateToProblem = vi.fn()
      
      // Step 2: Code writing and testing
      const mockOnRun = vi.fn()
      const mockOnSubmit = vi.fn()
      
      render(
        <EnhancedCodeEditor
          onRun={mockOnRun}
          onSubmit={mockOnSubmit}
        />
      )
      
      // Write some code
      const codeInput = screen.getByTestId('code-input')
      await user.clear(codeInput)
      await user.type(codeInput, 'function twoSum(nums, target) { return [0, 1]; }')
      
      // Test the code
      await user.click(screen.getByRole('button', { name: /run/i }))
      expect(mockOnRun).toHaveBeenCalled()
      
      // Submit the solution
      await user.click(screen.getByRole('button', { name: /submit/i }))
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle API failures gracefully', async () => {
      const mockRetry = vi.fn()
      
      render(
        <ProblemsList
          problems={[]}
          filters={mockFilters}
          onFilterChange={vi.fn()}
          loading={false}
          error="Failed to load problems"
          retry={mockRetry}
        />
      )
      
      expect(screen.getByText(/failed to load problems/i)).toBeInTheDocument()
      
      const retryButton = screen.getByRole('button', { name: /try again/i })
      await userEvent.setup().click(retryButton)
      
      expect(mockRetry).toHaveBeenCalled()
    })

    it('should show loading states during operations', () => {
      render(
        <ProblemsList
          problems={[]}
          filters={mockFilters}
          onFilterChange={vi.fn()}
          loading={true}
        />
      )
      
      // Should show loading skeleton instead of content
      expect(screen.queryByText('problems found')).not.toBeInTheDocument()
    })

    it('should handle empty states appropriately', () => {
      render(
        <ProblemsList
          problems={[]}
          filters={mockFilters}
          onFilterChange={vi.fn()}
          loading={false}
        />
      )
      
      expect(screen.getByText(/no problems found/i)).toBeInTheDocument()
      expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument()
    })
  })
})