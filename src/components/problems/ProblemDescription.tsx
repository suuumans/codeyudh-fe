import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Problem } from '@/types'

interface ProblemDescriptionProps {
  problem: Problem
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-2xl font-bold">{problem.title}</CardTitle>
          <Badge 
            variant="outline" 
            className={`capitalize ${getDifficultyColor(problem.difficulty)}`}
          >
            {problem.difficulty}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {problem.topics.map(topic => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground mt-2">
          Acceptance Rate: {problem.acceptanceRate}% | 
          Total Submissions: {problem.totalSubmissions.toLocaleString()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Problem Description */}
        <div>
          <h3 className="font-semibold mb-3">Description</h3>
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {problem.description}
          </div>
        </div>

        <Separator />

        {/* Examples */}
        {problem.examples.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Examples</h3>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4">
                  <div className="font-medium text-sm mb-2">Example {index + 1}:</div>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <span className="text-muted-foreground">Input: </span>
                      <span className="bg-background px-2 py-1 rounded">{example.input}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Output: </span>
                      <span className="bg-background px-2 py-1 rounded">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-muted-foreground">Explanation: </span>
                        <span>{example.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Constraints */}
        <div>
          <h3 className="font-semibold mb-3">Constraints</h3>
          <div className="text-sm font-mono bg-muted/50 rounded-lg p-4 whitespace-pre-line">
            {problem.constraints}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}