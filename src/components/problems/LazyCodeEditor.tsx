import { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

// Lazy load the Monaco Editor component
const EnhancedCodeEditor = lazy(() => 
  import('./EnhancedCodeEditor').then(module => ({
    default: module.EnhancedCodeEditor
  }))
)

// Loading fallback component
function CodeEditorSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code Editor</CardTitle>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        <div className="flex-1 border rounded-md overflow-hidden">
          <div className="h-full min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading code editor...</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

// Props interface (re-export from EnhancedCodeEditor)
export interface LazyCodeEditorProps {
  initialCode?: string
  initialLanguage?: string
  onRun?: (code: string, language: string) => void
  onSubmit?: (code: string, language: string) => void
  loading?: boolean
  runSuccess?: boolean
  runError?: boolean
  submitSuccess?: boolean
  submitError?: boolean
  result?: any[]
  error?: string
  stats?: any
  executionProgress?: number
  executionMessage?: string
}

export function LazyCodeEditor(props: LazyCodeEditorProps) {
  return (
    <Suspense fallback={<CodeEditorSkeleton />}>
      <EnhancedCodeEditor {...props} />
    </Suspense>
  )
}

// Also export a preload function for eager loading when needed
export const preloadCodeEditor = () => {
  import('./EnhancedCodeEditor')
}