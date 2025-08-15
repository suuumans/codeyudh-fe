import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { RegisterForm } from '../RegisterForm'

// Mock the auth hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuthActions: vi.fn(() => ({
    register: vi.fn(),
    clearError: vi.fn(),
    isRegisterLoading: false,
    registerError: null,
  })),
  useAuthStatus: vi.fn(() => ({
    error: null,
  })),
}))

describe('RegisterForm', () => {
  const mockRegister = vi.fn()
  const mockClearError = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Reset the mock implementation
    const { useAuthActions, useAuthStatus } = await import('@/hooks/useAuth')
    vi.mocked(useAuthActions).mockReturnValue({
      register: mockRegister,
      clearError: mockClearError,
      isRegisterLoading: false,
      registerError: null,
    })
    vi.mocked(useAuthStatus).mockReturnValue({
      error: null,
    })
  })

  it('renders registration form with all required fields', () => {
    render(<RegisterForm />)
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('validates username field correctly', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    // Test empty username
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    })
    
    // Test short username
    await user.type(usernameInput, 'ab')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument()
    })
    
    // Test invalid characters
    await user.clear(usernameInput)
    await user.type(usernameInput, 'user@name')
    await user.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText(/username can only contain letters, numbers, and underscores/i)).toBeInTheDocument()
    })
    
    // Test valid username
    await user.clear(usernameInput)
    await user.type(usernameInput, 'valid_user123')
    await waitFor(() => {
      expect(screen.queryByText(/username can only contain/i)).not.toBeInTheDocument()
    })
  })

  it('validates email field correctly', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
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
    render(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
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
  })

  it('shows password strength indicator', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    
    // Test weak password
    await user.type(passwordInput, 'weak')
    await waitFor(() => {
      expect(screen.getByText(/strength:/i)).toBeInTheDocument()
      expect(screen.getByText(/weak/i)).toBeInTheDocument()
      expect(screen.getByText(/suggestions:/i)).toBeInTheDocument()
    })
    
    // Test strong password
    await user.clear(passwordInput)
    await user.type(passwordInput, 'StrongPass123!')
    await waitFor(() => {
      expect(screen.getByText(/strong/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })
    
    // Test matching passwords
    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'password123')
    await waitFor(() => {
      expect(screen.queryByText(/passwords don't match/i)).not.toBeInTheDocument()
    })
  })

  it('calls register function with correct data on form submission', async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(usernameInput, 'testuser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled()
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
    })
  })

  it('calls onSuccess callback after successful registration', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValueOnce(undefined)
    
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(usernameInput, 'testuser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('displays loading state during registration', async () => {
    const { useAuthActions } = await import('@/hooks/useAuth')
    vi.mocked(useAuthActions).mockReturnValue({
      register: mockRegister,
      clearError: mockClearError,
      isRegisterLoading: true,
      registerError: null,
    })
    
    render(<RegisterForm />)
    
    expect(screen.getByText(/creating account.../i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeDisabled()
    expect(screen.getByLabelText(/^email$/i)).toBeDisabled()
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled()
    expect(screen.getByLabelText(/confirm password/i)).toBeDisabled()
  })

  it('displays registration error when present', async () => {
    const { useAuthActions } = await import('@/hooks/useAuth')
    vi.mocked(useAuthActions).mockReturnValue({
      register: mockRegister,
      clearError: mockClearError,
      isRegisterLoading: false,
      registerError: 'Username already exists',
    })
    
    render(<RegisterForm />)
    
    expect(screen.getByText(/username already exists/i)).toBeInTheDocument()
  })

  it('handles registration failure gracefully', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'))
    
    render(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(usernameInput, 'testuser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Registration failed:', expect.any(Error))
    })
    
    consoleErrorSpy.mockRestore()
  })
})