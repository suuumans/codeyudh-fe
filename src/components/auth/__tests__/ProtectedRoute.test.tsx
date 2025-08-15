import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import { ProtectedRoute, withProtectedRoute, useProtectedRoute } from '../ProtectedRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

// Mock TanStack Router
const mockNavigate = vi.fn()
const mockLocation = { pathname: '/dashboard' }

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}))

// Mock the auth hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuthStatus: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
  })),
}))

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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner when authentication is loading', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument()
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
  })

  it('shows unauthorized fallback when not authenticated', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
    expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument()
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
  })

  it('shows custom fallback when provided and not authenticated', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    const customFallback = <div>Custom Unauthorized Message</div>

    render(
      <TestWrapper>
        <ProtectedRoute fallback={customFallback}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText(/custom unauthorized message/i)).toBeInTheDocument()
    expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
  })

  it('renders children when authenticated', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText(/protected content/i)).toBeInTheDocument()
    expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument()
  })

  it('navigates to login when not authenticated', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/login',
        search: { returnTo: '/dashboard' },
        replace: true,
      })
    })
  })

  it('navigates to custom redirect path when specified', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <ProtectedRoute redirectTo="/signin">
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/signin',
        search: { returnTo: '/dashboard' },
        replace: true,
      })
    })
  })

  it('stores current location for return after login', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    // Mock different location
    mockLocation.pathname = '/problems/123'

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/login',
        search: { returnTo: '/problems/123' },
        replace: true,
      })
    })
  })
})

describe('withProtectedRoute HOC', () => {
  const TestComponent = ({ message }: { message: string }) => (
    <div>{message}</div>
  )

  it('wraps component with ProtectedRoute', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    const ProtectedTestComponent = withProtectedRoute(TestComponent)

    render(
      <TestWrapper>
        <ProtectedTestComponent message="Hello World" />
      </TestWrapper>
    )

    expect(screen.getByText(/hello world/i)).toBeInTheDocument()
  })

  it('passes options to ProtectedRoute', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    const customFallback = <div>Custom HOC Fallback</div>
    const ProtectedTestComponent = withProtectedRoute(TestComponent, {
      fallback: customFallback,
      redirectTo: '/custom-login',
    })

    render(
      <TestWrapper>
        <ProtectedTestComponent message="Hello World" />
      </TestWrapper>
    )

    expect(screen.getByText(/custom hoc fallback/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/custom-login',
        search: { returnTo: '/dashboard' },
        replace: true,
      })
    })
  })
})

describe('useProtectedRoute hook', () => {
  const TestHookComponent = ({ redirectTo }: { redirectTo?: string }) => {
    const { isAuthenticated, isLoading, checkAuth, shouldRedirect } = useProtectedRoute(redirectTo)
    
    return (
      <div>
        <div>Authenticated: {isAuthenticated.toString()}</div>
        <div>Loading: {isLoading.toString()}</div>
        <div>Should Redirect: {shouldRedirect.toString()}</div>
        <button onClick={checkAuth}>Check Auth</button>
      </div>
    )
  }

  it('returns correct authentication status', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <TestHookComponent />
      </TestWrapper>
    )

    expect(screen.getByText(/authenticated: true/i)).toBeInTheDocument()
    expect(screen.getByText(/loading: false/i)).toBeInTheDocument()
    expect(screen.getByText(/should redirect: false/i)).toBeInTheDocument()
  })

  it('indicates should redirect when not authenticated', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <TestHookComponent />
      </TestWrapper>
    )

    expect(screen.getByText(/authenticated: false/i)).toBeInTheDocument()
    expect(screen.getByText(/should redirect: true/i)).toBeInTheDocument()
  })
})