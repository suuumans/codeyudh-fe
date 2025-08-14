import { LoadingButton } from '@/components/ui/loading-button'
import { Send } from 'lucide-react'

interface SubmitButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  success?: boolean
  error?: boolean
}

export function SubmitButton({ 
  onClick, 
  loading = false, 
  disabled = false,
  success = false,
  error = false
}: SubmitButtonProps) {
  return (
    <LoadingButton
      onClick={onClick}
      loading={loading}
      success={success}
      error={error}
      disabled={disabled}
      loadingText="Submitting..."
      successText="Submitted!"
      errorText="Submit Failed"
    >
      <Send className="h-4 w-4" />
      Submit
    </LoadingButton>
  )
}