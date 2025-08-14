import { LoadingButton } from '@/components/ui/loading-button'
import { Play } from 'lucide-react'

interface RunButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  success?: boolean
  error?: boolean
}

export function RunButton({ 
  onClick, 
  loading = false, 
  disabled = false,
  success = false,
  error = false
}: RunButtonProps) {
  return (
    <LoadingButton
      onClick={onClick}
      loading={loading}
      success={success}
      error={error}
      disabled={disabled}
      variant="outline"
      loadingText="Running..."
      successText="Run Successful"
      errorText="Run Failed"
    >
      <Play className="h-4 w-4" />
      Run Code
    </LoadingButton>
  )
}