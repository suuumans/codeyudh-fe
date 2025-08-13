import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Search, ExternalLink, Code } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useFilteredSubmissions, useSubmissionFilters } from '@/hooks/useSubmissionStore'

interface SubmissionHistoryProps {
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

export function SubmissionHistory({ submissions, loading }: SubmissionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Use store-based filtering
  const filteredSubmissions = useFilteredSubmissions()
  const { setFilters } = useSubmissionFilters()

  // Paginate submissions
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique languages for filter
  const uniqueLanguages = Array.from(new Set(submissions.map(s => s.language)))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Submission History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select onValueChange={(value) => setFilters({ status: value })}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="wrong_answer">Wrong Answer</SelectItem>
              <SelectItem value="time_limit_exceeded">Time Limit</SelectItem>
              <SelectItem value="runtime_error">Runtime Error</SelectItem>
              <SelectItem value="compilation_error">Compile Error</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setFilters({ language: value })}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {uniqueLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedSubmissions.length} of {filteredSubmissions.length} submissions
        </div>

        {/* Table */}
        {paginatedSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No submissions found</p>
            <Button asChild>
              <Link to="/problems">Start Solving Problems</Link>
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Runtime</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Link 
                        to="/problems/$problemId" 
                        params={{ problemId: submission.problemId }}
                        className="hover:underline font-medium"
                      >
                        {submission.problemId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                    <TableCell>
                      {submission.memoryUsage ? `${submission.memoryUsage}MB` : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}