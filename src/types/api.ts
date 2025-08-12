export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

export interface ApiError {
    error: {
        code: string
        message: string
        details?: Record<string, string[]>
    }
    timestamp: string
    path: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
    expiresIn: number
}
