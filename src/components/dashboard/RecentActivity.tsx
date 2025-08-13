import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Submission, SubmissionStatus } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface RecentActivityProps {
  submissions: Submission[]
  loading?: boolean
}

function getStatusBadgeVariant(status: SubmissionStatus) {
  switch (status) {
    case 'accepted':
      return 'default'
    case 'wrong_answer':
      return 'destructive'
    case 'time_limit_exceeded':
      return 'secondary'
    case 'runtime_error':
      return 'destructive'
    case 'compilation_error':
      return 'destructive'
    case 'pending':
      return 'outline'
    default:
      return 'secondary'
  }
}

function getStatusLabel(status: SubmissionStatus) {
  switch (status) {
    case 'accepted':
      return 'Accepted'
    case 'wrong_answer':
      return 'Wrong Answer'
    case 'time_limit_exceeded':
      return 'Time Limit'
    case 'runtime_error':
      return 'Runtime Error'
    case 'compilation_error':
      return 'Compile Error'
    case 'pending':
      return 'Pending'
    default:
      return status
  }
}

export function RecentActivity({ submissions, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No recent submissions found</p>
            <Button asChild>
              <Link to="/problems">Start Solving Problems</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/profile">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.slice(0, 10).map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <Link 
                    to="/problems/$problemId" 
                    params={{ problemId: submission.problemId }}
                    className="hover:underline font-medium"
                  >
                    Problem #{submission.problemId}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {submission.language.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(submission.status)}>
                    {getStatusLabel(submission.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {submission.executionTime ? `${submission.executionTime}ms` : '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}