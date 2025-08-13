import type { Problem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Clock } from 'lucide-react'

interface ProblemCardProps {
    problem: Problem
    userProgress?: {
        status: 'not_attempted' | 'attempted' | 'solved'
        attempts?: number
    }
    onClick: (problemId: string) => void
}

const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusIcons = {
    solved: CheckCircle,
    attempted: Clock,
    not_attempted: Circle,
}

export function ProblemCard({ problem, userProgress, onClick }: ProblemCardProps) {
    const StatusIcon = statusIcons[userProgress?.status || 'not_attempted']
    
    return (
        <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick(problem.id)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                        {problem.title}
                    </CardTitle>
                    <StatusIcon 
                        className={`h-5 w-5 flex-shrink-0 ml-2 ${
                            userProgress?.status === 'solved' 
                                ? 'text-green-600' 
                                : userProgress?.status === 'attempted'
                                ? 'text-yellow-600'
                                : 'text-gray-400'
                        }`}
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                        variant="secondary" 
                        className={difficultyColors[problem.difficulty]}
                    >
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </Badge>
                    {problem.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                        </Badge>
                    ))}
                    {problem.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{problem.topics.length - 2} more
                        </Badge>
                    )}
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Acceptance Rate</span>
                        <span>{problem.acceptanceRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={problem.acceptanceRate} className="h-2" />
                </div>
                
                <div className="text-sm text-muted-foreground">
                    {problem.totalSubmissions.toLocaleString()} submissions
                </div>
            </CardContent>
        </Card>
    )
}