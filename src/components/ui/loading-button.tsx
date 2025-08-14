import { Button, buttonVariants } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { VariantProps } from 'class-variance-authority'

interface LoadingButtonProps extends 
  React.ComponentProps<'button'>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean
  success?: boolean
  error?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  showStatusIcon?: boolean
  asChild?: boolean
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({
    children,
    loading = false,
    success = false,
    error = false,
    loadingText,
    successText,
    errorText,
    showStatusIcon = true,
    className,
    disabled,
    variant,
    size,
    asChild,
    ...props
  }, ref) => {
    const getContent = () => {
      if (loading) {
        return (
          <>
            {showStatusIcon && <Loader2 className="h-4 w-4 animate-spin" />}
            {loadingText || children}
          </>
        )
      }
      
      if (success) {
        return (
          <>
            {showStatusIcon && <CheckCircle className="h-4 w-4" />}
            {successText || children}
          </>
        )
      }
      
      if (error) {
        return (
          <>
            {showStatusIcon && <XCircle className="h-4 w-4" />}
            {errorText || children}
          </>
        )
      }
      
      return children
    }

    const getVariant = () => {
      if (success) return 'default'
      if (error) return 'destructive'
      return variant || 'default'
    }

    return (
      <Button
        ref={ref}
        className={cn(
          'flex items-center gap-2 transition-all duration-200',
          {
            'bg-green-600 hover:bg-green-700': success,
            'cursor-not-allowed opacity-50': loading,
          },
          className
        )}
        disabled={disabled || loading}
        variant={getVariant()}
        size={size}
        asChild={asChild}
        {...props}
      >
        {getContent()}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'