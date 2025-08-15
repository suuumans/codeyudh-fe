import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { ErrorBoundary, useErrorBoundary } from '../error-boundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

// Component that uses the useErrorBoundary hook
const UseErrorBoundaryComponent = () => {
  const { captureError, resetError } = useErrorBoundary()
  
  return (
    <div>
      <div>Hook component</div>
      <button onClick={() => captureError(new Error('Hook error'))}>
        Trigger Error
      </button>
      <button onClick={resetError}>
        Reset Error
      </button>
    </div>
  )
}

describe('ErrorBoundary', () => {
  const mockOnError = vi.fn()
  const mockReload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    })
    
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <div>Child component</div>
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('Child component')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('renders error UI when child component throws an error', () => {
    render(
      <TestWrapper>
        <ErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred. Please try refreshing the page.')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    render(
      <TestWrapper>
        <ErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <TestWrapper>
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('resets error state when try again button is clicked', async () => {
    const user = userEvent.setup()
    
    const { rerender } = render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /try again/i }))

    // Re-render with no error
    rerender(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('refreshes page when refresh button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    await user.click(screen.getByRole('button', { name: /refresh page/i }))
    
    expect(mockReload).toHaveBeenCalled()
  })

  it('displays error details in alert', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('Error Details')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('logs error to console', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    )
  })
})

describe('useErrorBoundary hook', () => {
  beforeEach(() => {
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('provides captureError and resetError functions', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <UseErrorBoundaryComponent />
        </ErrorBoundary>
      </TestWrapper>
    )

    expect(screen.getByText('Hook component')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /trigger error/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset error/i })).toBeInTheDocument()
  })

  it('throws error when captureError is called', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <ErrorBoundary>
          <UseErrorBoundaryComponent />
        </ErrorBoundary>
      </TestWrapper>
    )

    await user.click(screen.getByRole('button', { name: /trigger error/i }))

    // Error should be caught by ErrorBoundary
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Hook error')).toBeInTheDocument()
  })

  it('resets error state when resetError is called', async () => {
    const user = userEvent.setup()
    
    // Component that can trigger and reset errors
    const TestComponent = () => {
      const { captureError, resetError } = useErrorBoundary()
      const [shouldError, setShouldError] = React.useState(false)
      
      React.useEffect(() => {
        if (shouldError) {
          captureError(new Error('Test hook error'))
        }
      }, [shouldError, captureError])
      
      return (
        <div>
          <div>Test component</div>
          <button onClick={() => setShouldError(true)}>Trigger</button>
          <button onClick={() => { resetError(); setShouldError(false); }}>Reset</button>
        </div>
      )
    }
    
    render(
      <TestWrapper>
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      </TestWrapper>
    )

    // Initially no error
    expect(screen.getByText('Test component')).toBeInTheDocument()

    // Trigger error
    await user.click(screen.getByRole('button', { name: /trigger/i }))
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Reset error
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(screen.getByText('Test component')).toBeInTheDocument()
  })
})