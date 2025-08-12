export interface User {
    id: string
    username: string
    email: string
    avatar?: string
    createdAt: Date
    updatedAt: Date
    statistics: UserStatistics
}

export interface UserStatistics {
    totalSolved: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
    currentStreak: number
    maxStreak: number
    acceptanceRate: number
    ranking: number
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export interface UserProblemProgress {
    problemId: string
    status: 'not_attempted' | 'attempted' | 'solved'
    bestSubmission?: string
    attempts: number
}
