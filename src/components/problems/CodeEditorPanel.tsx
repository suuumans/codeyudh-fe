import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { QuickExecutionProgress } from '@/components/ui/execution-progress'
import { useTheme } from '@/components/theme/ThemeProvider'
import { RunButton } from './RunButton'
import { SubmitButton } from './SubmitButton'
import { TestResults, type TestResult } from './TestResults'
import { ExecutionStats } from './ExecutionStats'
import type { ExecutionStats as ExecutionStatsType } from './ExecutionStats'

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript', monacoLang: 'javascript' },
  { label: 'Python', value: 'python', monacoLang: 'python' },
  { label: 'Java', value: 'java', monacoLang: 'java' },
  { label: 'C++', value: 'cpp', monacoLang: 'cpp' },
  { label: 'TypeScript', value: 'typescript', monacoLang: 'typescript' },
  { label: 'Go', value: 'go', monacoLang: 'go' },
  { label: 'Rust', value: 'rust', monacoLang: 'rust' },
]

const DEFAULT_CODE_TEMPLATES = {
  javascript: `function solution() {
    // Write your code here
    
}`,
  python: `def solution():
    # Write your code here
    pass`,
  java: `public class Solution {
    public void solution() {
        // Write your code here
        
    }
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void solution() {
        // Write your code here
        
    }
};`,
  typescript: `function solution(): void {
    // Write your code here
    
}`,
  go: `package main

import "fmt"

func solution() {
    // Write your code here
    
}`,
  rust: `fn solution() {
    // Write your code here
    
}`
}

// Types are now imported from the component files

interface CodeEditorPanelProps {
  initialCode?: string
  initialLanguage?: string
  onRun?: (code: string, language: string) => void
  onSubmit?: (code: string, language: string) => void
  loading?: boolean
  runSuccess?: boolean
  runError?: boolean
  submitSuccess?: boolean
  submitError?: boolean
  result?: TestResult[]
  error?: string
  stats?: ExecutionStatsType
  executionProgress?: number
  executionMessage?: string
}

export function CodeEditorPanel({
  initialCode = '',
  initialLanguage = 'javascript',
  onRun,
  onSubmit,
  loading = false,
  runSuccess = false,
  runError = false,
  submitSuccess = false,
  submitError = false,
  result,
  error,
  stats,
  executionProgress = 0,
  executionMessage,
}: CodeEditorPanelProps) {
  const [language, setLanguage] = useState(initialLanguage)
  const [code, setCode] = useState(initialCode)
  const { theme } = useTheme()

  // Update code template when language changes
  useEffect(() => {
    if (!initialCode) {
      const template = DEFAULT_CODE_TEMPLATES[language as keyof typeof DEFAULT_CODE_TEMPLATES]
      if (template) {
        setCode(template)
      }
    }
  }, [language, initialCode])

  // Set initial code template if no initial code provided
  useEffect(() => {
    if (!initialCode && !code) {
      const template = DEFAULT_CODE_TEMPLATES[language as keyof typeof DEFAULT_CODE_TEMPLATES]
      if (template) {
        setCode(template)
      }
    }
  }, [initialCode, code, language])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    // Optionally reset code to template when changing language
    const template = DEFAULT_CODE_TEMPLATES[newLanguage as keyof typeof DEFAULT_CODE_TEMPLATES]
    if (template && !code.trim()) {
      setCode(template)
    }
  }

  const selectedLanguage = LANGUAGES.find(lang => lang.value === language)
  const monacoLanguage = selectedLanguage?.monacoLang || 'javascript'
  
  // Determine Monaco theme based on current theme
  const getMonacoTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light'
    }
    return theme === 'dark' ? 'vs-dark' : 'vs-light'
  }
  
  const monacoTheme = getMonacoTheme()

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code Editor</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        {/* Monaco Editor */}
        <div className="flex-1 border rounded-md overflow-hidden">
          <MonacoEditor
            height="100%"
            language={monacoLanguage}
            value={code}
            theme={monacoTheme}
            onChange={value => setCode(value || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'line',
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <RunButton 
            onClick={() => onRun?.(code, language)} 
            loading={loading}
            success={runSuccess}
            error={runError}
          />
          <SubmitButton 
            onClick={() => onSubmit?.(code, language)} 
            loading={loading}
            success={submitSuccess}
            error={submitError}
          />
        </div>

        {/* Execution Progress */}
        <QuickExecutionProgress
          status={loading ? 'running' : runSuccess || submitSuccess ? 'completed' : runError || submitError ? 'failed' : 'idle'}
          message={executionMessage}
          progress={executionProgress}
        />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Test Results */}
        {result && (
          <TestResults results={result} loading={loading} />
        )}

        {/* Execution Stats */}
        {stats && (
          <ExecutionStats stats={stats} loading={loading} />
        )}
      </CardContent>
    </Card>
  )
}
