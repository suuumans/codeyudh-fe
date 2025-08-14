import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PanelLeft, 
  PanelRight, 
  Code, 
  FileText, 
  TestTube,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResponsiveProblemLayoutProps {
  problemDescription: React.ReactNode
  codeEditor: React.ReactNode
  testResults?: React.ReactNode
  executionStats?: React.ReactNode
  className?: string
}

export function ResponsiveProblemLayout({
  problemDescription,
  codeEditor,
  testResults,
  executionStats,
  className,
}: ResponsiveProblemLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal')
  const [activeTab, setActiveTab] = useState('code')

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile layout with tabs
  if (isMobile) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        {/* Mobile Header with Description Toggle */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <h2 className="text-lg font-semibold">Problem Solving</h2>
          <Sheet open={showDescription} onOpenChange={setShowDescription}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Problem
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-96 p-0">
              <div className="h-full overflow-auto">
                {problemDescription}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Code</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="flex-1 mt-0">
            <div className="h-full p-4">
              {codeEditor}
            </div>
          </TabsContent>

          <TabsContent value="results" className="flex-1 mt-0">
            <div className="h-full p-4 overflow-auto">
              {testResults || (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run your code to see test results</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 mt-0">
            <div className="h-full p-4 overflow-auto">
              {executionStats || (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Submit your code to see execution statistics</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Desktop layout with resizable panels
  return (
    <div className={cn('flex h-full', className)}>
      {/* Problem Description Panel */}
      <div className="w-1/2 border-r flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <h2 className="text-lg font-semibold">Problem Description</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
          >
            {layout === 'horizontal' ? (
              <PanelRight className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {problemDescription}
        </div>
      </div>

      {/* Code Editor and Results Panel */}
      <div className="w-1/2 flex flex-col">
        {layout === 'horizontal' ? (
          // Horizontal layout - code editor and results side by side
          <div className="flex h-full">
            <div className="w-1/2 border-r flex flex-col">
              <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                <h3 className="font-semibold">Code Editor</h3>
              </div>
              <div className="flex-1">
                {codeEditor}
              </div>
            </div>
            <div className="w-1/2 flex flex-col">
              <Tabs defaultValue="results" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                  <TabsTrigger value="results">Test Results</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
                <TabsContent value="results" className="flex-1 mt-0 p-4">
                  {testResults || (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Run your code to see test results</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="stats" className="flex-1 mt-0 p-4">
                  {executionStats || (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Submit your code to see execution statistics</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          // Vertical layout - code editor on top, results on bottom
          <div className="flex flex-col h-full">
            <div className="h-1/2 border-b flex flex-col">
              <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                <h3 className="font-semibold">Code Editor</h3>
              </div>
              <div className="flex-1">
                {codeEditor}
              </div>
            </div>
            <div className="h-1/2 flex flex-col">
              <Tabs defaultValue="results" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                  <TabsTrigger value="results">Test Results</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
                <TabsContent value="results" className="flex-1 mt-0 p-4 overflow-auto">
                  {testResults || (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Run your code to see test results</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="stats" className="flex-1 mt-0 p-4 overflow-auto">
                  {executionStats || (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Submit your code to see execution statistics</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}