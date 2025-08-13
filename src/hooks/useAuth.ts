// Re-export all auth hooks from the new TanStack Store implementation
export {
  useAuth,
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useAuthActions,
  useAuthToken,
  useAuthStatus,
} from './useAuthStore'