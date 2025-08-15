// Accessibility tests using axe-core
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ProblemCard } from '@/components/problems/ProblemCard'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { FilterPanel } from '@/components/problems/FilterPanel'
import { mockProblem } from '../mocks'
import type { ProblemFilters } from '@/types'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock dependencies for accessibility tests
vi.mock('@/hooks/useAuth', () => ({
  useAuthActions: () => ({
    login: vi.fn(),
    register: vi.fn(),
    clearError: vi.fn(),
    isLoginLoading: false,
    isRegisterLoading: false,
    loginError: null,
    registerError: null,
  }),
  useAuthStatus: () => ({
    error: null,
  }),
}))

vi.mock('@/hooks/useUIStore', () => ({
  useProblemsViewMode: () => ({
    viewMode: 'grid',
    setViewMode: vi.fn(),
  }),
  useFilterPanel: () => ({
    isOpen: false,
    setOpen: vi.fn(),
  }),
}))

describe('Accessibility Tests', () => {
  describe('Authentication Components', () => {
    it('LoginForm should be accessible', async () => {
      const { container } = render(<LoginForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('RegisterForm should be accessible', async () => {
      const { container } = render(<RegisterForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper form labels and descriptions', async () => {
      const { container } = render(<LoginForm />)
      
      // Check for proper labeling
      const emailInput = container.querySelector('input[type="email"]')
      const passwordInput = container.querySelector('input[type="password"]')
      
      expect(emailInput).toHaveAttribute('aria-describedby')
      expect(passwordInput).toHaveAttribute('aria-describedby')
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Problem Components', () => {
    it('ProblemCard should be accessible', async () => {
      const { container } = render(
        <ProblemCard 
          problem={mockProblem} 
          onClick={vi.fn()}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('ProblemsList should be accessible', async () => {
      const mockFilters: ProblemFilters = {
        difficulty: [],
        topics: [],
        status: 'all',
        search: '',
      }

      const { container } = render(
        <ProblemsList
          problems={[mockProblem]}
          filters={mockFilters}
          onFilterChange={vi.fn()}
          loading={false}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('FilterPanel should be accessible', async () => {
      const mockFilters: ProblemFilters = {}

      const { container } = render(
        <FilterPanel
          filters={mockFilters}
          onFiltersChange={vi.fn()}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA roles and properties', async () => {
      const { container } = render(
        <ProblemCard 
          problem={mockProblem} 
          onClick={vi.fn()}
        />
      )
      
      // Check for proper button role
      const cardButton = container.querySelector('button')
      expect(cardButton).toHaveAttribute('role', 'button')
      
      // Check for accessible name
      expect(cardButton).toHaveAccessibleName()
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Interactive Elements', () => {
    it('should have sufficient color contrast', async () => {
      const { container } = render(<LoginForm />)
      
      // axe will check color contrast automatically
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })

    it('should be keyboard navigable', async () => {
      const { container } = render(<LoginForm />)
      
      // Check for proper focus management
      const focusableElements = container.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      focusableElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1')
      })
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper focus indicators', async () => {
      const { container } = render(
        <ProblemCard 
          problem={mockProblem} 
          onClick={vi.fn()}
        />
      )
      
      // axe will check for focus indicators
      const results = await axe(container, {
        rules: {
          'focus-order-semantics': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Accessibility', () => {
    it('should associate form controls with labels', async () => {
      const { container } = render(<RegisterForm />)
      
      const inputs = container.querySelectorAll('input')
      inputs.forEach(input => {
        // Each input should have an associated label
        const id = input.getAttribute('id')
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`)
          expect(label).toBeTruthy()
        }
      })
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should provide error messages accessibly', async () => {
      const { container } = render(<LoginForm />)
      
      // Check for proper error message association
      const results = await axe(container, {
        rules: {
          'aria-describedby': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })

    it('should have proper fieldset and legend for grouped controls', async () => {
      const mockFilters: ProblemFilters = {}

      const { container } = render(
        <FilterPanel
          filters={mockFilters}
          onFiltersChange={vi.fn()}
        />
      )
      
      // Check for proper grouping of related controls
      const results = await axe(container, {
        rules: {
          'fieldset': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Dynamic Content', () => {
    it('should announce loading states to screen readers', async () => {
      const { container } = render(
        <ProblemsList
          problems={[]}
          filters={{}}
          onFilterChange={vi.fn()}
          loading={true}
        />
      )
      
      // Check for aria-live regions for dynamic content
      const liveRegion = container.querySelector('[aria-live]')
      expect(liveRegion).toBeTruthy()
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle error states accessibly', async () => {
      const { container } = render(
        <ProblemsList
          problems={[]}
          filters={{}}
          onFilterChange={vi.fn()}
          loading={false}
          error="Failed to load problems"
        />
      )
      
      // Check for proper error announcement
      const results = await axe(container, {
        rules: {
          'aria-live': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch targets', async () => {
      const { container } = render(
        <ProblemCard 
          problem={mockProblem} 
          onClick={vi.fn()}
        />
      )
      
      // Check for minimum touch target size (44x44px)
      const button = container.querySelector('button')
      if (button) {
        const styles = window.getComputedStyle(button)
        const minHeight = parseInt(styles.minHeight) || parseInt(styles.height)
        const minWidth = parseInt(styles.minWidth) || parseInt(styles.width)
        
        // Should meet WCAG AA guidelines for touch targets
        expect(minHeight).toBeGreaterThanOrEqual(44)
        expect(minWidth).toBeGreaterThanOrEqual(44)
      }
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Custom Accessibility Rules', () => {
    it('should pass custom accessibility checks', async () => {
      const { container } = render(<LoginForm />)
      
      // Custom rules for specific requirements
      const results = await axe(container, {
        rules: {
          // Enable specific rules for our application
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
        },
      })
      expect(results).toHaveNoViolations()
    })
  })
})