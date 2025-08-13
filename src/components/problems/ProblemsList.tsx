import type { Problem, ProblemFilters } from '@/types'
import { ProblemCard } from './ProblemCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Grid, List, Search } from 'lucide-react'
import { useState } from 'react'

interface ProblemsListProps {
    problems: Problem[]
    filters: ProblemFilters
    onFilterChange: (filters: ProblemFilters) => void
    loading?: boolean
}

function ProblemCardSkeleton() {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-18" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-4 w-32" />
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No problems found</h3>
            <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
            </p>
        </div>
    )
}

export function ProblemsList({ problems, loading }: ProblemsListProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const handleProblemClick = (problemId: string) => {
        // TODO: Navigate to problem detail page
        console.log('Navigate to problem:', problemId)
    }

    if (loading) {
        return (
            <div className={`grid gap-4 ${
                viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
            }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProblemCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (problems.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {problems.length} problem{problems.length !== 1 ? 's' : ''} found
                </div>
                <div className="flex gap-1 border rounded-md p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 w-8 p-0"
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 w-8 p-0"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Problems Grid/List */}
            <div className={`grid gap-4 ${
                viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
            }`}>
                {problems.map((problem) => (
                    <ProblemCard
                        key={problem.id}
                        problem={problem}
                        onClick={handleProblemClick}
                        // TODO: Add user progress data
                        userProgress={undefined}
                    />
                ))}
            </div>
        </div>
    )
}