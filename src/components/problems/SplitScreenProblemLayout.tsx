import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { useUIStore } from '@/hooks/useUIStore'
import { ProblemDescription } from './ProblemDescription'
import { LazyCodeEditor, preloadCodeEditor } from './LazyCodeEditor'
import type { Problem } from '@/types'
import type { TestResult } from './TestResults'
import type { ExecutionStats as ExecutionStatsType } from './ExecutionStats'
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface SplitScreenProblemLayoutProps {
  problem: Problem
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

export function SplitScreenProblemLayout({
  problem,
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
}: SplitScreenProblemLayoutProps) {
  const { state, actions } = useUIStore()
  const [problemPanelCollapsed, setProblemPanelCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleProblemPanel = () => {
    setProblemPanelCollapsed(!problemPanelCollapsed)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Preload code editor when component mounts
  useEffect(() => {
    preloadCodeEditor()
  }, [])

  const resetLayout = () => {
    setProblemPanelCollapsed(false)
    setIsFullscreen(false)
    actions.updateEditorPreferences({ splitView: true })
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  if (!state.editorPreferences.splitView) {
    // Traditional stacked layout
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-150px)]">
          {/* Problem Description */}
          <div className="overflow-auto">
            <ProblemDescription problem={problem} />
          </div>
          
          {/* Code Editor Panel */}
          <div className="flex flex-col">
            <LazyCodeEditor
              initialCode={initialCode}
              initialLanguage={initialLanguage}
              onRun={onRun}
              onSubmit={onSubmit}
              loading={loading}
              runSuccess={runSuccess}
              runError={runError}
              submitSuccess={submitSuccess}
              submitError={submitError}
              result={result}
              error={error}
              stats={stats}
              executionProgress={executionProgress}
              executionMessage={executionMessage}
            />
          </div>
        </div>
      </div>
    )
  }

  // Split-screen layout
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'container mx-auto px-4 py-6'}`}>
      <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-150px)]'} gap-1`}>
        {/* Problem Description Panel */}
        <div 
          className={`transition-all duration-300 ${
            problemPanelCollapsed ? 'w-0 overflow-hidden' : 'w-1/2'
          }`}
        >
          <Card className="h-full flex flex-col">
            {/* Problem Panel Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Problem Description</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetLayout}
                  title="Reset Layout"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleProblemPanel}
                  title="Collapse Problem Panel"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Problem Content */}
            <div className="flex-1 overflow-auto p-4">
              <ProblemDescription problem={problem} />
            </div>
          </Card>
        </div>

        {/* Resize Handle */}
        {!problemPanelCollapsed && (
          <div className="w-1 bg-border hover:bg-primary/20 cursor-col-resize transition-colors" />
        )}

        {/* Code Editor Panel */}
        <div className={`transition-all duration-300 ${
          problemPanelCollapsed ? 'w-full' : 'w-1/2'
        }`}>
          <Card className="h-full flex flex-col">
            {/* Editor Panel Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Code Editor</h2>
              <div className="flex items-center gap-2">
                {problemPanelCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleProblemPanel}
                    title="Show Problem Panel"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetLayout}
                  title="Reset Layout"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Editor Content */}
            <div className="flex-1 p-4">
              <LazyCodeEditor
                initialCode={initialCode}
                initialLanguage={initialLanguage}
                onRun={onRun}
                onSubmit={onSubmit}
                loading={loading}
                runSuccess={runSuccess}
                runError={runError}
                submitSuccess={submitSuccess}
                submitError={submitError}
                result={result}
                error={error}
                stats={stats}
                executionProgress={executionProgress}
                executionMessage={executionMessage}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Fullscreen Exit Hint */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Card className="px-3 py-2 bg-background/95 backdrop-blur-sm border shadow-lg">
            <p className="text-sm text-muted-foreground">
              Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Esc</kbd> or click minimize to exit fullscreen
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}