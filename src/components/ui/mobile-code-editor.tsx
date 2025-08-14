import { useState, useEffect, useRef } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  Tablet, 
  Monitor,
  Settings,
  Type
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/ThemeProvider'

interface MobileCodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  onLanguageChange: (language: string) => void
  languages: Array<{ label: string; value: string; monacoLang: string }>
  className?: string
  readOnly?: boolean
}

export function MobileCodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  languages,
  className,
  readOnly = false,
}: MobileCodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)

  const selectedLanguage = languages.find(lang => lang.value === language)
  const monacoLanguage = selectedLanguage?.monacoLang || 'javascript'

  // Determine Monaco theme based on current theme
  const getMonacoTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light'
    }
    return theme === 'dark' ? 'vs-dark' : 'vs-light'
  }

  // Get responsive editor options based on view mode
  const getEditorOptions = () => {
    const baseOptions = {
      fontSize,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on' as const,
      automaticLayout: true,
      readOnly,
      theme: getMonacoTheme(),
    }

    switch (viewMode) {
      case 'mobile':
        return {
          ...baseOptions,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'off' as const,
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: 'none' as const,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            vertical: 'hidden' as const,
            horizontal: 'hidden' as const,
          },
        }
      case 'tablet':
        return {
          ...baseOptions,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on' as const,
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 2,
          renderLineHighlight: 'line' as const,
        }
      default:
        return {
          ...baseOptions,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          lineNumbers: 'on' as const,
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line' as const,
        }
    }
  }

  // Auto-detect view mode based on screen size
  useEffect(() => {
    const updateViewMode = () => {
      const width = window.innerWidth
      if (width < 640) {
        setViewMode('mobile')
      } else if (width < 1024) {
        setViewMode('tablet')
      } else {
        setViewMode('desktop')
      }
    }

    updateViewMode()
    window.addEventListener('resize', updateViewMode)
    return () => window.removeEventListener('resize', updateViewMode)
  }, [])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    // Add touch-friendly features for mobile
    if (viewMode === 'mobile') {
      editor.updateOptions({
        selectOnLineNumbers: false,
        roundedSelection: true,
        cursorStyle: 'block',
        cursorBlinking: 'smooth',
      })
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta))
    setFontSize(newSize)
  }

  const EditorContent = () => (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* View Mode Indicators */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="h-6 w-6 p-0"
            >
              <Smartphone className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
              className="h-6 w-6 p-0"
            >
              <Tablet className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="h-6 w-6 p-0"
            >
              <Monitor className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Font Size Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => adjustFontSize(-1)}
            className="h-6 w-6 p-0 text-xs"
          >
            A-
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => adjustFontSize(1)}
            className="h-6 w-6 p-0 text-xs"
          >
            A+
          </Button>

          {/* Settings */}
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="h-3 w-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Editor Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustFontSize(-1)}
                    >
                      <Type className="h-3 w-3" />
                      -
                    </Button>
                    <span className="text-sm w-8 text-center">{fontSize}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustFontSize(1)}
                    >
                      <Type className="h-3 w-3" />
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">View Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={viewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('mobile')}
                    >
                      <Smartphone className="h-3 w-3 mr-1" />
                      Mobile
                    </Button>
                    <Button
                      variant={viewMode === 'tablet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('tablet')}
                    >
                      <Tablet className="h-3 w-3 mr-1" />
                      Tablet
                    </Button>
                    <Button
                      variant={viewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('desktop')}
                    >
                      <Monitor className="h-3 w-3 mr-1" />
                      Desktop
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-6 w-6 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={monacoLanguage}
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={getEditorOptions()}
        />
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <EditorContent />
      </div>
    )
  }

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardContent className="p-0 flex-1 min-h-0">
        <EditorContent />
      </CardContent>
    </Card>
  )
}