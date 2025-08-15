import { useState, useEffect, useRef, useCallback } from 'react'
import MonacoEditor, { type Monaco } from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { QuickExecutionProgress } from '@/components/ui/execution-progress'
import { useTheme } from '@/components/theme/ThemeProvider'
import { useUIStore } from '@/hooks/useUIStore'
import { RunButton } from './RunButton'
import { SubmitButton } from './SubmitButton'
import { TestResults, type TestResult } from './TestResults'
import { ExecutionStats } from './ExecutionStats'
import type { ExecutionStats as ExecutionStatsType } from './ExecutionStats'
import { 
  Settings, 
  Maximize2, 
  Minimize2, 
  Code, 
  Palette,
  Type,
  Keyboard,
  WrapText,
  Map
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript', monacoLang: 'javascript' },
  { label: 'Python', value: 'python', monacoLang: 'python' },
  { label: 'Java', value: 'java', monacoLang: 'java' },
  { label: 'C++', value: 'cpp', monacoLang: 'cpp' },
  { label: 'TypeScript', value: 'typescript', monacoLang: 'typescript' },
  { label: 'Go', value: 'go', monacoLang: 'go' },
  { label: 'Rust', value: 'rust', monacoLang: 'rust' },
]

const CODE_TEMPLATES = {
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

const CODE_SNIPPETS = {
  javascript: {
    'for-loop': 'for (let i = 0; i < array.length; i++) {\n    // code here\n}',
    'while-loop': 'while (condition) {\n    // code here\n}',
    'function': 'function functionName(params) {\n    // code here\n    return result;\n}',
    'array-methods': '// Common array methods\narray.map(item => item)\narray.filter(item => condition)\narray.reduce((acc, item) => acc + item, 0)',
  },
  python: {
    'for-loop': 'for i in range(len(array)):\n    # code here',
    'while-loop': 'while condition:\n    # code here',
    'function': 'def function_name(params):\n    # code here\n    return result',
    'list-comprehension': '[item for item in array if condition]',
  },
  java: {
    'for-loop': 'for (int i = 0; i < array.length; i++) {\n    // code here\n}',
    'while-loop': 'while (condition) {\n    // code here\n}',
    'method': 'public returnType methodName(params) {\n    // code here\n    return result;\n}',
    'arraylist': 'List<Integer> list = new ArrayList<>();',
  },
  cpp: {
    'for-loop': 'for (int i = 0; i < n; i++) {\n    // code here\n}',
    'while-loop': 'while (condition) {\n    // code here\n}',
    'function': 'returnType functionName(params) {\n    // code here\n    return result;\n}',
    'vector': 'vector<int> vec;',
  }
}

interface EnhancedCodeEditorProps {
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

export function EnhancedCodeEditor({
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
}: EnhancedCodeEditorProps) {
  const [language, setLanguage] = useState(initialLanguage)
  const [code, setCode] = useState(initialCode)
  const { theme } = useTheme()
  const { state, actions } = useUIStore()
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)

  // Initialize code template when language changes
  useEffect(() => {
    if (!initialCode) {
      const template = CODE_TEMPLATES[language as keyof typeof CODE_TEMPLATES]
      if (template) {
        setCode(template)
      }
    }
  }, [language, initialCode])

  // Set initial code template if no initial code provided
  useEffect(() => {
    if (!initialCode && !code) {
      const template = CODE_TEMPLATES[language as keyof typeof CODE_TEMPLATES]
      if (template) {
        setCode(template)
      }
    }
  }, [initialCode, code, language])

  // Setup Monaco editor with enhanced features
  const handleEditorDidMount = useCallback((editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Setup key bindings based on preferences
    if (state.editorPreferences.keyBindings === 'vim') {
      import('monaco-vim').then((monacoVim: any) => {
        monacoVim.initVimMode(editor, document.getElementById('vim-status'))
      }).catch(console.warn)
    } else if (state.editorPreferences.keyBindings === 'emacs') {
      import('monaco-emacs').then((monacoEmacs: any) => {
        new monacoEmacs.EmacsExtension(editor)
      }).catch(console.warn)
    }

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (state.editorPreferences.autoFormat) {
        formatCode()
      }
    })

    // Add snippet support
    monaco.languages.registerCompletionItemProvider(getMonacoLanguage(), {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }
        
        const suggestions = Object.entries(CODE_SNIPPETS[language as keyof typeof CODE_SNIPPETS] || {}).map(([label, snippet]) => ({
          label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: `Code snippet: ${label}`,
          range
        }))
        
        return { suggestions }
      }
    })
  }, [state.editorPreferences.keyBindings, state.editorPreferences.autoFormat, language])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    // Reset code to template when changing language if current code is empty or default
    const currentTemplate = CODE_TEMPLATES[language as keyof typeof CODE_TEMPLATES]
    const newTemplate = CODE_TEMPLATES[newLanguage as keyof typeof CODE_TEMPLATES]
    
    if (!code.trim() || code === currentTemplate) {
      setCode(newTemplate || '')
    }
  }

  const formatCode = useCallback(async () => {
    if (!editorRef.current || !monacoRef.current) return

    try {
      await editorRef.current.getAction('editor.action.formatDocument').run()
    } catch (error) {
      console.warn('Auto-formatting failed:', error)
    }
  }, [])

  const insertSnippet = useCallback((snippet: string) => {
    if (!editorRef.current) return
    
    const selection = editorRef.current.getSelection()
    editorRef.current.executeEdits('insert-snippet', [{
      range: selection,
      text: snippet,
    }])
    editorRef.current.focus()
  }, [])

  const selectedLanguage = LANGUAGES.find(lang => lang.value === language)
  const getMonacoLanguage = () => selectedLanguage?.monacoLang || 'javascript'
  
  // Determine Monaco theme based on current theme
  const getMonacoTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light'
    }
    return theme === 'dark' ? 'vs-dark' : 'vs-light'
  }

  const availableSnippets = CODE_SNIPPETS[language as keyof typeof CODE_SNIPPETS] || {}

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Enhanced Code Editor</CardTitle>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
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

            {/* Code Snippets */}
            {Object.keys(availableSnippets).length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Code className="h-4 w-4 mr-1" />
                    Snippets
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Code Snippets</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(availableSnippets).map(([label, snippet]) => (
                    <DropdownMenuItem
                      key={label}
                      onClick={() => insertSnippet(snippet)}
                      className="cursor-pointer"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Editor Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Key Bindings */}
                <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center">
                  <Keyboard className="h-3 w-3 mr-1" />
                  Key Bindings
                </DropdownMenuLabel>
                {(['default', 'vim', 'emacs'] as const).map((binding) => (
                  <DropdownMenuCheckboxItem
                    key={binding}
                    checked={state.editorPreferences.keyBindings === binding}
                    onCheckedChange={() => actions.updateEditorPreferences({ keyBindings: binding })}
                  >
                    {binding.charAt(0).toUpperCase() + binding.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
                
                <DropdownMenuSeparator />
                
                {/* Display Options */}
                <DropdownMenuCheckboxItem
                  checked={state.editorPreferences.wordWrap}
                  onCheckedChange={(checked) => actions.updateEditorPreferences({ wordWrap: checked })}
                >
                  <WrapText className="h-4 w-4 mr-2" />
                  Word Wrap
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem
                  checked={state.editorPreferences.minimap}
                  onCheckedChange={(checked) => actions.updateEditorPreferences({ minimap: checked })}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Minimap
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem
                  checked={state.editorPreferences.autoFormat}
                  onCheckedChange={(checked) => actions.updateEditorPreferences({ autoFormat: checked })}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Auto Format
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                {/* Font Size */}
                <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center">
                  <Type className="h-3 w-3 mr-1" />
                  Font Size
                </DropdownMenuLabel>
                {[12, 14, 16, 18].map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    checked={state.editorPreferences.fontSize === size}
                    onCheckedChange={() => actions.updateEditorPreferences({ fontSize: size })}
                  >
                    {size}px
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Split View Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={actions.toggleSplitView}
            >
              {state.editorPreferences.splitView ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Key Bindings Status */}
        {state.editorPreferences.keyBindings !== 'default' && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {state.editorPreferences.keyBindings.toUpperCase()} Mode
            </Badge>
            {state.editorPreferences.keyBindings === 'vim' && (
              <div id="vim-status" className="text-xs text-muted-foreground"></div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        {/* Monaco Editor */}
        <div className="flex-1 border rounded-md overflow-hidden">
          <MonacoEditor
            height="100%"
            language={getMonacoLanguage()}
            value={code}
            theme={getMonacoTheme()}
            onChange={value => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              fontSize: state.editorPreferences.fontSize,
              minimap: { enabled: state.editorPreferences.minimap },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: state.editorPreferences.tabSize,
              insertSpaces: true,
              wordWrap: state.editorPreferences.wordWrap ? 'on' : 'off',
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
              formatOnPaste: state.editorPreferences.autoFormat,
              formatOnType: state.editorPreferences.autoFormat,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              snippetSuggestions: 'top',
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
          
          {state.editorPreferences.autoFormat && (
            <Button
              variant="outline"
              size="sm"
              onClick={formatCode}
              disabled={loading}
            >
              <Palette className="h-4 w-4 mr-1" />
              Format
            </Button>
          )}
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