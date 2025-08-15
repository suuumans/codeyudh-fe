import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { EnhancedCodeEditor } from '../EnhancedCodeEditor'

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: vi.fn(({ onChange, onMount, value }) => {
    // Simulate Monaco editor behavior
    const handleChange = (newValue: string) => {
      onChange?.(newValue)
    }

    // Mock editor instance
    const mockEditor = {
      getAction: vi.fn(() => ({ run: vi.fn() })),
      getSelection: vi.fn(() => ({ startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1 })),
      executeEdits: vi.fn(),
      focus: vi.fn(),
      addCommand: vi.fn(),
    }

    // Mock Monaco instance
    const mockMonaco = {
      KeyMod: { CtrlCmd: 1 },
      KeyCode: { KeyS: 1 },
      languages: {
        registerCompletionItemProvider: vi.fn(),
        CompletionItemKind: { Snippet: 1 },
        CompletionItemInsertTextRule: { InsertAsSnippet: 1 },
      },
    }

    // Call onMount if provided
    React.useEffect(() => {
      if (onMount) {
        onMount(mockEditor, mockMonaco)
      }
    }, [onMount])

    return (
      <div data-testid="monaco-editor">
        <textarea
          data-testid="code-input"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Code editor"
        />
      </div>
    )
  }),
}))

// Mock theme provider
vi.mock('@/components/theme/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

// Mock UI store
vi.mock('@/hooks/useUIStore', () => ({
  useUIStore: () => ({
    state: {
      editorPreferences: {
        keyBindings: 'default',
        fontSize: 14,
        minimap: true,
        wordWrap: false,
        autoFormat: true,
        tabSize: 2,
        splitView: false,
      },
    },
    actions: {
      updateEditorPreferences: vi.fn(),
      toggleSplitView: vi.fn(),
    },
  }),
}))

// Mock dynamic imports
vi.mock('monaco-vim', () => ({
  initVimMode: vi.fn(),
}))

vi.mock('monaco-emacs', () => ({
  EmacsExtension: vi.fn(),
}))

describe('EnhancedCodeEditor', () => {
  const mockOnRun = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders code editor with default settings', () => {
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('Enhanced Code Editor')).toBeInTheDocument()
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('displays initial code when provided', () => {
    const initialCode = 'console.log("Hello World");'
    
    render(
      <EnhancedCodeEditor
        initialCode={initialCode}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByDisplayValue(initialCode)).toBeInTheDocument()
  })

  it('changes language when language selector is used', async () => {
    const user = userEvent.setup()
    
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // Open language selector
    await user.click(screen.getByRole('combobox'))
    
    // Select Python
    await user.click(screen.getByText('Python'))
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Python')).toBeInTheDocument()
    })
  })

  it('calls onRun with correct parameters when run button is clicked', async () => {
    const user = userEvent.setup()
    const testCode = 'console.log("test");'
    
    render(
      <EnhancedCodeEditor
        initialCode={testCode}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: /run/i }))
    
    expect(mockOnRun).toHaveBeenCalledWith(testCode, 'javascript')
  })

  it('calls onSubmit with correct parameters when submit button is clicked', async () => {
    const user = userEvent.setup()
    const testCode = 'console.log("test");'
    
    render(
      <EnhancedCodeEditor
        initialCode={testCode}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith(testCode, 'javascript')
  })

  it('shows loading state correctly', () => {
    render(
      <EnhancedCodeEditor
        loading={true}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // Check if buttons show loading state
    const runButton = screen.getByRole('button', { name: /run/i })
    const submitButton = screen.getByRole('button', { name: /submit/i })
    
    expect(runButton).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'Compilation error: syntax error on line 5'
    
    render(
      <EnhancedCodeEditor
        error={errorMessage}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('shows success state for run operation', () => {
    render(
      <EnhancedCodeEditor
        runSuccess={true}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // The success state should be reflected in the RunButton component
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument()
  })

  it('shows success state for submit operation', () => {
    render(
      <EnhancedCodeEditor
        submitSuccess={true}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // The success state should be reflected in the SubmitButton component
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('opens settings dropdown when settings button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // Find and click settings button
    const settingsButton = screen.getByRole('button', { name: '' }) // Settings icon button
    await user.click(settingsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Editor Settings')).toBeInTheDocument()
      expect(screen.getByText('Key Bindings')).toBeInTheDocument()
      expect(screen.getByText('Word Wrap')).toBeInTheDocument()
      expect(screen.getByText('Minimap')).toBeInTheDocument()
      expect(screen.getByText('Auto Format')).toBeInTheDocument()
    })
  })

  it('shows code snippets dropdown for supported languages', async () => {
    const user = userEvent.setup()
    
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // Find and click snippets button
    const snippetsButton = screen.getByRole('button', { name: /snippets/i })
    await user.click(snippetsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Code Snippets')).toBeInTheDocument()
      expect(screen.getByText('for-loop')).toBeInTheDocument()
      expect(screen.getByText('while-loop')).toBeInTheDocument()
      expect(screen.getByText('function')).toBeInTheDocument()
    })
  })

  it('updates code when typing in editor', async () => {
    const user = userEvent.setup()
    
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    const codeInput = screen.getByTestId('code-input')
    await user.clear(codeInput)
    await user.type(codeInput, 'console.log("new code");')
    
    expect(codeInput).toHaveValue('console.log("new code");')
  })

  it('shows execution progress when provided', () => {
    render(
      <EnhancedCodeEditor
        executionProgress={50}
        executionMessage="Running test cases..."
        loading={true}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('Running test cases...')).toBeInTheDocument()
  })

  it('displays test results when provided', () => {
    const testResults = [
      {
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        actualOutput: '[0,1]',
        passed: true,
        executionTime: 100,
        memoryUsage: 1024,
      },
    ]
    
    render(
      <EnhancedCodeEditor
        result={testResults}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // TestResults component should be rendered
    expect(screen.getByText('[2,7,11,15]')).toBeInTheDocument()
  })

  it('displays execution stats when provided', () => {
    const stats = {
      executionTime: 150,
      memoryUsage: 2048,
      testsPassed: 5,
      totalTests: 10,
    }
    
    render(
      <EnhancedCodeEditor
        stats={stats}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // ExecutionStats component should be rendered with stats
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('handles language change and updates code template', async () => {
    const user = userEvent.setup()
    
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // Change to Python
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Python'))
    
    await waitFor(() => {
      // Should show Python template
      expect(screen.getByDisplayValue(/def solution/)).toBeInTheDocument()
    })
  })

  it('preserves custom code when changing languages', async () => {
    const user = userEvent.setup()
    const customCode = 'console.log("my custom code");'
    
    render(
      <EnhancedCodeEditor
        initialCode={customCode}
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    // Change language
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Python'))
    
    // Custom code should be preserved (not replaced with template)
    expect(screen.getByDisplayValue(customCode)).toBeInTheDocument()
  })

  it('shows format button when auto format is enabled', () => {
    render(
      <EnhancedCodeEditor
        onRun={mockOnRun}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByRole('button', { name: /format/i })).toBeInTheDocument()
  })
})