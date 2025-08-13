import { useEffect } from 'react'
import { toast } from 'sonner'

export function useApiErrorToast(error: unknown) {
  useEffect(() => {
    if (!error) return
    let message = 'An unexpected error occurred.'
    if (typeof error === 'string') message = error
    if (typeof error === 'object' && error && 'message' in error) message = (error as any).message
    toast.error(message)
  }, [error])
}
