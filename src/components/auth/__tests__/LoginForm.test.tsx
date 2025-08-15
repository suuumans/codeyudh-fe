import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { LoginForm } from '../LoginForm'

// Mock the auth hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuthActions: vi.fn(() => ({
    login: vi.fn(),
    clearError: vi.fn(),
    isLoginLoading: false,
    loginError: null,
  })),
  useAuthStatus: vi.fn(() => ({
    error: null,
  })),
}))

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockClearError = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Reset the mock implementation
    const { useAuthActions, useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthActions).mockReturnValue({
      login: mockLogin,
      clearError: mockClearError,
      isLoginLoading: false,
      loginError: null,
    })
    vi.mocked(useAuthStatus).mockReturnValue({
      error: null,
    })
  })

  it('renders login form with all required fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument()
  })

  it('validates email field correctly', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Test empty email
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
    
    // Test invalid email
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
    
    // Test valid email
    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com')
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
    })
  })

  it('validates password field correctly', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Test empty password
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    
    // Test short password
    await user.type(passwordInput, '123')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
    
    // Test valid password
    await user.clear(passwordInput)
    await user.type(passwordInput, 'password123')
    await waitFor(() => {
      expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument()
    })
  })

  it('calls login function with correct data on form submission', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={mockOnSuccess} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled()
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('calls onSuccess callback after successful login', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce(undefined)
    
    render(<LoginForm onSuccess={mockOnSuccess} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('displays loading state during login', async () => {
    const { useAuthActions } = await import('@/hooks/useAuth')
    vi.mocked(useAuthActions).mockReturnValue({
      login: mockLogin,
      clearError: mockClearError,
      isLoginLoading: true,
      loginError: null,
    })
    
    render(<LoginForm />)
    
    expect(screen.getByText(/signing in.../i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeDisabled()
    expect(screen.getByLabelText(/password/i)).toBeDisabled()
  })

  it('displays login error when present', async () => {
    const { useAuthActions } = await import('@/hooks/useAuth')
    vi.mocked(useAuthActions).mockReturnValue({
      login: mockLogin,
      clearError: mockClearError,
      isLoginLoading: false,
      loginError: 'Invalid credentials',
    })
    
    render(<LoginForm />)
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('displays general auth error when present', async () => {
    const { useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthStatus).mockReturnValue({
      error: 'Network error',
    })
    
    render(<LoginForm />)
    
    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })

  it('handles login failure gracefully', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockLogin.mockRejectedValueOnce(new Error('Login failed'))
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error))
    })
    
    consoleErrorSpy.mockRestore()
  })
})