import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load the ProblemDetail component
const ProblemDetail = lazy(() => 
  import('@/components/problems/ProblemDetail').then(module => ({
    default: module.ProblemDetail
  }))
)

function ProblemDetailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading problem...</span>
      </div>
    }>
      <ProblemDetail />
    </Suspense>
  )
}

export const Route = createFileRoute('/problems/$problemId')({
  component: ProblemDetailPage,
})
