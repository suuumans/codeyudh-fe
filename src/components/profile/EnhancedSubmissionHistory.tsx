import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DetailedSubmissionView } from './DetailedSubmissionView'
import type { Submission, SubmissionStatus } from '@/types'
import { formatDistanceToNow, format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'
import { 
  Search, 
  ExternalLink, 
  Code, 
  Filter,
  Calendar as CalendarIcon,
  TrendingUp,
  BarChart3,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface EnhancedSubmissionHistoryProps {
  submissions: Submission[]
  loading?: boolean
}

interface SubmissionFilters {
  search: string
  status: string
  language: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
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

export function EnhancedSubmissionHistory({ submissions, loading }: EnhancedSubmissionHistoryProps) {
  const [filters, setFilters] = useState<SubmissionFilters>({
    search: '',
    status: 'all',
    language: 'all',
    dateFrom: undefined,
    dateTo: undefined,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'analytics'>('table')
  
  const itemsPerPage = 10

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !filters.search || 
      submission.problemId.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || submission.status === filters.status
    
    const matchesLanguage = filters.language === 'all' || submission.language === filters.language
    
    const submissionDate = new Date(submission.submittedAt)
    const matchesDateFrom = !filters.dateFrom || isAfter(submissionDate, startOfDay(filters.dateFrom))
    const matchesDateTo = !filters.dateTo || isBefore(submissionDate, endOfDay(filters.dateTo))
    
    return matchesSearch && matchesStatus && matchesLanguage && matchesDateFrom && matchesDateTo
  })

  // Paginate submissions
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique languages for filter
  const uniqueLanguages = Array.from(new Set(submissions.map(s => s.language)))

  // Calculate analytics
  const analytics = {
    totalSubmissions: submissions.length,
    acceptedSubmissions: submissions.filter(s => s.status === 'accepted').length,
    acceptanceRate: submissions.length > 0 ? (submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100 : 0,
    languageDistribution: uniqueLanguages.map(lang => ({
      language: lang,
      count: submissions.filter(s => s.language === lang).length,
      acceptanceRate: submissions.filter(s => s.language === lang).length > 0 
        ? (submissions.filter(s => s.language === lang && s.status === 'accepted').length / submissions.filter(s => s.language === lang).length) * 100 
        : 0
    })),
    recentActivity: submissions
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 7)
      .map(s => ({
        date: format(new Date(s.submittedAt), 'MMM dd'),
        submissions: submissions.filter(sub => 
          format(new Date(sub.submittedAt), 'MMM dd') === format(new Date(s.submittedAt), 'MMM dd')
        ).length
      }))
      .reduce((acc, curr) => {
        const existing = acc.find(item => item.date === curr.date)
        if (!existing) {
          acc.push(curr)
        }
        return acc
      }, [] as { date: string; submissions: number }[])
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      language: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    })
    setCurrentPage(1)
  }

  const exportSubmissions = () => {
    const csvContent = [
      ['Problem', 'Language', 'Status', 'Runtime', 'Memory', 'Submitted'].join(','),
      ...filteredSubmissions.map(s => [
        s.problemId,
        s.language,
        s.status,
        s.executionTime || 'N/A',
        s.memoryUsage || 'N/A',
        format(new Date(s.submittedAt), 'yyyy-MM-dd HH:mm:ss')
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'submissions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

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

  if (selectedSubmission) {
    return (
      <DetailedSubmissionView
        submission={selectedSubmission}
        previousSubmissions={submissions.filter(s => s.id !== selectedSubmission.id)}
        onClose={() => setSelectedSubmission(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Submission History</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportSubmissions}
            disabled={filteredSubmissions.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'analytics')}>
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === 'analytics' ? (
        /* Analytics View */
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{analytics.totalSubmissions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                    <p className="text-2xl font-bold">{analytics.acceptedSubmissions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                    <p className="text-2xl font-bold">{analytics.acceptanceRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Language Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.languageDistribution.map(lang => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{lang.language.toUpperCase()}</Badge>
                      <span className="text-sm">{lang.count} submissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(lang.count / analytics.totalSubmissions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {lang.acceptanceRate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.recentActivity.map(activity => (
                  <div key={activity.date} className="flex items-center justify-between py-2">
                    <span className="text-sm">{activity.date}</span>
                    <Badge variant="secondary">{activity.submissions} submissions</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Submissions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Advanced Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
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

                <Select 
                  value={filters.language} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}
                >
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

              {/* Date Range Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">From:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {filters.dateFrom ? format(filters.dateFrom, 'MMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {filters.dateTo ? format(filters.dateTo, 'MMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              </div>
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
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
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
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
      )}
    </div>
  )
}