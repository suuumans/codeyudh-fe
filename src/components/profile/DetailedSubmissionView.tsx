import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import MonacoEditor from '@monaco-editor/react'
import { useTheme } from '@/components/theme/ThemeProvider'
import type { Submission, SubmissionStatus } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import {
  Clock,
  Code,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  GitCompare,
  Calendar
} from 'lucide-react'

interface DetailedSubmissionViewProps {
  submission: Submission
  previousSubmissions?: Submission[]
  onClose?: () => void
}

interface TestCaseResult {
  id: string
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  executionTime: number
  memoryUsage: number
  error?: string
}

function getStatusIcon(status: SubmissionStatus) {
  switch (status) {
    case 'accepted':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'wrong_answer':
    case 'runtime_error':
    case 'compilation_error':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'time_limit_exceeded':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-blue-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

function getStatusLabel(status: SubmissionStatus) {
  switch (status) {
    case 'accepted':
      return 'Accepted'
    case 'wrong_answer':
      return 'Wrong Answer'
    case 'time_limit_exceeded':
      return 'Time Limit Exceeded'
    case 'runtime_error':
      return 'Runtime Error'
    case 'compilation_error':
      return 'Compilation Error'
    case 'pending':
      return 'Pending'
    default:
      return status
  }
}

export function DetailedSubmissionView({
  submission,
  previousSubmissions = [],
  onClose
}: DetailedSubmissionViewProps) {
  const { theme } = useTheme()
  const [selectedComparison, setSelectedComparison] = useState<string | null>(null)

  // Mock test case results - in real app this would come from the submission data
  const testCaseResults: TestCaseResult[] = [
    {
      id: '1',
      input: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
      actualOutput: '[0,1]',
      passed: true,
      executionTime: 45,
      memoryUsage: 12.5
    },
    {
      id: '2',
      input: 'nums = [3,2,4], target = 6',
      expectedOutput: '[1,2]',
      actualOutput: '[1,2]',
      passed: true,
      executionTime: 38,
      memoryUsage: 12.8
    },
    {
      id: '3',
      input: 'nums = [3,3], target = 6',
      expectedOutput: '[0,1]',
      actualOutput: '[1,0]',
      passed: false,
      executionTime: 52,
      memoryUsage: 13.2,
      error: 'Wrong Answer: Expected [0,1] but got [1,0]'
    }
  ]

  const passedTests = testCaseResults.filter(t => t.passed).length
  const totalTests = testCaseResults.length
  const passRate = (passedTests / totalTests) * 100

  // Calculate performance metrics compared to previous submissions
  const getPerformanceImprovement = () => {
    if (previousSubmissions.length === 0) return null

    const recentSubmissions = previousSubmissions
      .filter(s => s.problemId === submission.problemId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5)

    if (recentSubmissions.length === 0) return null

    const avgRuntime = recentSubmissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) / recentSubmissions.length
    const avgMemory = recentSubmissions.reduce((sum, s) => sum + (s.memoryUsage || 0), 0) / recentSubmissions.length

    const runtimeImprovement = avgRuntime > 0 ? ((avgRuntime - (submission.executionTime || 0)) / avgRuntime) * 100 : 0
    const memoryImprovement = avgMemory > 0 ? ((avgMemory - (submission.memoryUsage || 0)) / avgMemory) * 100 : 0

    return {
      runtime: runtimeImprovement,
      memory: memoryImprovement,
      attempts: recentSubmissions.length + 1
    }
  }

  const performanceMetrics = getPerformanceImprovement()

  const getMonacoTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light'
    }
    return theme === 'dark' ? 'vs-dark' : 'vs-light'
  }

  const comparisonSubmission = selectedComparison
    ? previousSubmissions.find(s => s.id === selectedComparison)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon(submission.status)}
          <div>
            <h2 className="text-2xl font-bold">Submission Details</h2>
            <p className="text-muted-foreground">
              Submitted {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Status and Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(submission.status)}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">{getStatusLabel(submission.status)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Runtime</p>
                <p className="font-semibold">
                  {submission.executionTime ? `${submission.executionTime}ms` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Memory</p>
                <p className="font-semibold">
                  {submission.memoryUsage ? `${submission.memoryUsage}MB` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-semibold">{submission.language.toUpperCase()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Runtime Improvement</span>
                  <span className={`text-sm font-medium ${performanceMetrics.runtime > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {performanceMetrics.runtime > 0 ? '+' : ''}{performanceMetrics.runtime.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.abs(performanceMetrics.runtime)}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Memory Improvement</span>
                  <span className={`text-sm font-medium ${performanceMetrics.memory > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {performanceMetrics.memory > 0 ? '+' : ''}{performanceMetrics.memory.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.abs(performanceMetrics.memory)}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Attempt Number</span>
                  <span className="text-sm font-medium">#{performanceMetrics.attempts}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Based on last 5 submissions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="code" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="comparison">Compare</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Code Tab */}
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Submitted Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <MonacoEditor
                  height="400px"
                  language={submission.language}
                  value={submission.code}
                  theme={getMonacoTheme()}
                  options={{
                    readOnly: true,
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: 'on',
                    folding: true,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Results Tab */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Test Results
                <Badge variant={passRate === 100 ? 'default' : 'destructive'}>
                  {passedTests}/{totalTests} Passed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testCaseResults.map((testCase, index) => (
                  <Card key={testCase.id} className={`border-l-4 ${testCase.passed ? 'border-l-green-500' : 'border-l-red-500'
                    }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {testCase.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">Test Case {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{testCase.executionTime}ms</span>
                          <span>{testCase.memoryUsage}MB</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Input:</p>
                          <code className="bg-muted p-2 rounded block">{testCase.input}</code>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Expected:</p>
                          <code className="bg-muted p-2 rounded block">{testCase.expectedOutput}</code>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Actual:</p>
                          <code className={`p-2 rounded block ${testCase.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {testCase.actualOutput}
                          </code>
                        </div>
                      </div>

                      {testCase.error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-red-800 text-sm">{testCase.error}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Compare Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previousSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No previous submissions to compare</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Compare with:</label>
                    <select
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                      value={selectedComparison || ''}
                      onChange={(e) => setSelectedComparison(e.target.value || null)}
                    >
                      <option value="">Select a submission</option>
                      {previousSubmissions.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {getStatusLabel(sub.status)} - {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {comparisonSubmission && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Current Submission</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <span>{getStatusLabel(submission.status)}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-md overflow-hidden">
                            <MonacoEditor
                              height="300px"
                              language={submission.language}
                              value={submission.code}
                              theme={getMonacoTheme()}
                              options={{
                                readOnly: true,
                                fontSize: 12,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                lineNumbers: 'on',
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Previous Submission</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(comparisonSubmission.status)}
                            <span>{getStatusLabel(comparisonSubmission.status)}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-md overflow-hidden">
                            <MonacoEditor
                              height="300px"
                              language={comparisonSubmission.language}
                              value={comparisonSubmission.code}
                              theme={getMonacoTheme()}
                              options={{
                                readOnly: true,
                                fontSize: 12,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                lineNumbers: 'on',
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Submission Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Over Time */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{passRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Test Pass Rate</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {previousSubmissions.filter(s => s.problemId === submission.problemId).length + 1}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Attempts</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Language Distribution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Language Usage</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(previousSubmissions.map(s => s.language))).map(lang => {
                      const count = previousSubmissions.filter(s => s.language === lang).length
                      const percentage = (count / previousSubmissions.length) * 100
                      return (
                        <div key={lang} className="flex items-center justify-between">
                          <span className="text-sm">{lang.toUpperCase()}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-xs text-muted-foreground w-12">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}