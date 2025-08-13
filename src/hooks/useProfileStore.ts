import { useStore } from '@tanstack/react-store'
import { profileStore, profileActions } from '@/stores/profileStore'
// User type is used in function parameters

export function useProfileStore() {
  return useStore(profileStore)
}

export function useProfileForm() {
  const { isEditing, formData, isSaving, errors } = useStore(profileStore)
  
  return {
    isEditing,
    formData,
    isSaving,
    errors,
    setEditing: profileActions.setEditing,
    initializeForm: profileActions.initializeForm,
    updateFormData: profileActions.updateFormData,
    setSaving: profileActions.setSaving,
    setErrors: profileActions.setErrors,
    clearErrors: profileActions.clearErrors,
    resetForm: profileActions.resetForm,
  }
}