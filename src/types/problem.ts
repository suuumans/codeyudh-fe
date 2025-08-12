export type ProblemDifficulty = 'easy' | 'medium' | 'hard'

export interface Problem {
    id: string
    title: string
    description: string
    difficulty: ProblemDifficulty
    topics: string[]
    constraints: string
    examples: Example[]
    testCases: TestCase[]
    acceptanceRate: number
    totalSubmissions: number
    createdAt: Date
}

export interface Example {
    input: string
    output: string
    explanation?: string
}

export interface TestCase {
    input: string
    expectedOutput: string
    isHidden: boolean
}

export interface ProblemFilters {
    difficulty?: ProblemDifficulty[]
    topics?: string[]
    status?: ('not_attempted' | 'attempted' | 'solved')[]
    search?: string
}
