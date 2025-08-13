import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export interface TestResult {
  id?: string
  input?: string
  expectedOutput?: string
  actualOutput?: string
  passed: boolean
  message: string
  executionTime?: number
  memoryUsage?: number
  error?: string
}

interface TestResultsProps {
  results: TestResult[]
  loading?: boolean
}

export function TestResults({ results, loading = false }: TestResultsProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Running tests...</div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
              <div className="h-5 w-12 bg-muted rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return null
  }

  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="test-results">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-sm font-medium">
            {passedCount === totalCount ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            Test Results ({passedCount}/{totalCount} passed)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={result.id || index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={result.passed ? 'default' : 'destructive'}
                      className="flex items-center gap-1"
                    >
                      {result.passed ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {result.passed ? 'Pass' : 'Fail'}
                    </Badge>
                    <span className="font-medium text-sm">Test Case {index + 1}</span>
                  </div>
                  {(result.executionTime || result.memoryUsage) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {result.executionTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.executionTime}ms
                        </div>
                      )}
                      {result.memoryUsage && (
                        <div>{result.memoryUsage}MB</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {result.message}
                </div>

                {result.error && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-800 dark:text-red-200 font-mono">
                        {result.error}
                      </div>
                    </div>
                  </div>
                )}

                {(result.input || result.expectedOutput || result.actualOutput) && (
                  <div className="space-y-2 text-xs">
                    {result.input && (
                      <div>
                        <span className="font-medium text-muted-foreground">Input: </span>
                        <code className="bg-muted px-2 py-1 rounded font-mono">{result.input}</code>
                      </div>
                    )}
                    {result.expectedOutput && (
                      <div>
                        <span className="font-medium text-muted-foreground">Expected: </span>
                        <code className="bg-muted px-2 py-1 rounded font-mono">{result.expectedOutput}</code>
                      </div>
                    )}
                    {result.actualOutput && (
                      <div>
                        <span className="font-medium text-muted-foreground">Actual: </span>
                        <code className={`px-2 py-1 rounded font-mono ${
                          result.passed 
                            ? 'bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-200'
                        }`}>
                          {result.actualOutput}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}