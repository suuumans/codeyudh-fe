import { createFileRoute } from '@tanstack/react-router'
import { ProblemDetail } from '@/components/problems/ProblemDetail'

export const Route = createFileRoute('/problems/$problemId')({
  component: ProblemDetail,
})
