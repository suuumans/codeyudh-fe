import { Store } from '@tanstack/store'
import type { User } from '@/types'

export interface ProfileState {
  // Profile form state
  isEditing: boolean
  formData: {
    username: string
    email: string
    avatar: string
  }
  isSaving: boolean
  
  // Profile form validation
  errors: {
    username?: string
    email?: string
    avatar?: string
  }
}

export const profileStore = new Store<ProfileState>({
  isEditing: false,
  formData: {
    username: '',
    email: '',
    avatar: '',
  },
  isSaving: false,
  errors: {},
})

// Actions
export const profileActions = {
  // Editing state
  setEditing: (isEditing: boolean) => {
    profileStore.setState((state) => ({
      ...state,
      isEditing,
    }))
  },
  
  // Initialize form data from user
  initializeForm: (user: User) => {
    profileStore.setState((state) => ({
      ...state,
      formData: {
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
      },
      errors: {},
    }))
  },
  
  // Update form data
  updateFormData: (data: Partial<ProfileState['formData']>) => {
    profileStore.setState((state) => ({
      ...state,
      formData: { ...state.formData, ...data },
    }))
  },
  
  // Set saving state
  setSaving: (isSaving: boolean) => {
    profileStore.setState((state) => ({
      ...state,
      isSaving,
    }))
  },
  
  // Set form errors
  setErrors: (errors: ProfileState['errors']) => {
    profileStore.setState((state) => ({
      ...state,
      errors,
    }))
  },
  
  // Clear errors
  clearErrors: () => {
    profileStore.setState((state) => ({
      ...state,
      errors: {},
    }))
  },
  
  // Reset form to user data
  resetForm: (user: User) => {
    profileStore.setState((state) => ({
      ...state,
      formData: {
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
      },
      errors: {},
      isEditing: false,
    }))
  },
}