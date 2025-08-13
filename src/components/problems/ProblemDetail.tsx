import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import type { Problem } from '@/types'
import { CodeEditorPanel } from './CodeEditorPanel'
import { ProblemDescription } from './ProblemDescription'

// TODO: Replace with real API call
const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    difficulty: 'easy',
    topics: ['Array', 'Hash Table'],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    testCases: [],
    acceptanceRate: 49.2,
    totalSubmissions: 8234567,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.',
    difficulty: 'medium',
    topics: ['Linked List', 'Math', 'Recursion'],
    constraints: 'The number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9\nIt is guaranteed that the list represents a number that does not have leading zeros.',
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      }
    ],
    testCases: [],
    acceptanceRate: 38.7,
    totalSubmissions: 4567890,
    createdAt: new Date('2023-01-02'),
  }
]

export function ProblemDetail() {
  // Use correct params signature for TanStack Router v1+
  const params = useParams({ from: '/problems/$problemId' })
  const problemId = params.problemId
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch with loading state
    const fetchProblem = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setProblem(mockProblems.find(p => p.id === problemId) || null)
      setLoading(false)
    }
    
    fetchProblem()
  }, [problemId])

  const [testResult, setTestResult] = useState<any[] | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [stats, setStats] = useState<{ runtime: number; memory: number; runtimePercentile?: number; memoryPercentile?: number } | undefined>(undefined)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
            <p className="text-muted-foreground">
              The problem you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-150px)]">
        {/* Problem Description */}
        <div className="overflow-auto">
          <ProblemDescription problem={problem} />
        </div>
        
        {/* Code Editor Panel */}
        <div className="flex flex-col">
          <CodeEditorPanel
            initialCode={''}
            initialLanguage="javascript"
            onRun={(_code, _language) => {
              // Simulate test run
              setTestResult([
                { 
                  passed: true, 
                  message: 'Sample test case passed.',
                  input: 'nums = [2,7,11,15], target = 9',
                  expectedOutput: '[0,1]',
                  actualOutput: '[0,1]',
                  executionTime: 45
                },
                { 
                  passed: false, 
                  message: 'Edge case failed.',
                  input: 'nums = [3,3], target = 6',
                  expectedOutput: '[0,1]',
                  actualOutput: '[1,0]',
                  executionTime: 52,
                  error: 'Wrong Answer: Expected [0,1] but got [1,0]'
                },
              ])
              setStats({ 
                runtime: 120, 
                memory: 32, 
                runtimePercentile: 75, 
                memoryPercentile: 68 
              })
              setError(undefined)
            }}
            onSubmit={(_code, _language) => {
              // Simulate submission
              setTestResult([
                { 
                  passed: true, 
                  message: 'All test cases passed.',
                  executionTime: 38
                },
              ])
              setStats({ 
                runtime: 110, 
                memory: 30, 
                runtimePercentile: 85, 
                memoryPercentile: 92 
              })
              setError(undefined)
            }}
            loading={false}
            result={testResult}
            error={error}
            stats={stats}
          />
        </div>
      </div>
    </div>
  )
}
