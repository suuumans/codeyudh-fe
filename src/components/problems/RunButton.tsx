import { Button } from '@/components/ui/button'
import { Play, Loader2 } from 'lucide-react'

interface RunButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function RunButton({ onClick, loading = false, disabled = false }: RunButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading || disabled}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      {loading ? 'Running...' : 'Run Code'}
    </Button>
  )
}