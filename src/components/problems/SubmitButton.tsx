import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function SubmitButton({ onClick, loading = false, disabled = false }: SubmitButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading || disabled}
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}