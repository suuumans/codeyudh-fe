import api from '@/lib/api'
import type { 
  CodeExecutionRequest, 
  CodeExecutionResponse, 
  Submission,
  ApiResponse 
} from '@/types'

export const codeExecutionApi = {
  runCode: async (request: CodeExecutionRequest): Promise<CodeExecutionResponse> => {
    const response = await api.post<ApiResponse<CodeExecutionResponse>>(
      `/problems/${request.problemId}/run`,
      {
        code: request.code,
        language: request.language,
        testCases: request.testCases
      }
    )
    return response.data.data
  },

  submitCode: async (request: CodeExecutionRequest): Promise<Submission> => {
    const response = await api.post<ApiResponse<Submission>>(
      `/problems/${request.problemId}/submit`,
      {
        code: request.code,
        language: request.language
      }
    )
    return response.data.data
  },

  getSubmissionResult: async (submissionId: string): Promise<Submission> => {
    const response = await api.get<ApiResponse<Submission>>(`/submissions/${submissionId}`)
    return response.data.data
  },

  getSupportedLanguages: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/execution/languages')
    return response.data.data
  },
}