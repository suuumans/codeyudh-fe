export type ProgrammingLanguage =
    | 'javascript'
    | 'python'
    | 'java'
    | 'cpp'
    | 'c'
    | 'typescript'

export type SubmissionStatus =
    | 'pending'
    | 'accepted'
    | 'wrong_answer'
    | 'time_limit_exceeded'
    | 'runtime_error'
    | 'compilation_error'

export interface Submission {
    id: string
    userId: string
    problemId: string
    code: string
    language: ProgrammingLanguage
    status: SubmissionStatus
    executionTime?: number
    memoryUsage?: number
    testResults: TestResult[]
    submittedAt: Date
}

export interface TestResult {
    input: string
    expectedOutput: string
    actualOutput: string
    passed: boolean
    executionTime: number
    memoryUsage: number
}

export interface CodeExecutionRequest {
    code: string
    language: ProgrammingLanguage
    problemId: string
    testCases?: Array<{
        input: string
        expectedOutput: string
        isHidden: boolean
    }>
}

export interface CodeExecutionResponse {
    success: boolean
    results: TestResult[]
    executionTime: number
    memoryUsage: number
    error?: string
}
