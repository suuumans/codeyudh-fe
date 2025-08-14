import type { Problem, ProblemFilters } from '@/types'
import { ProblemCard } from './ProblemCard'
import { LoadingState } from '@/components/ui/loading-state'
import { ProblemsListSkeleton } from '@/components/ui/loading-skeletons'
import { Button } from '@/components/ui/button'
import { Grid, List } from 'lucide-react'
import { useProblemsViewMode } from '@/hooks/useUIStore'

interface ProblemsListProps {
    problems: Problem[]
    filters: ProblemFilters
    onFilterChange: (filters: ProblemFilters) => void
    loading?: boolean
    error?: string | Error | null
    retry?: () => void
}

export function ProblemsList({ 
    problems, 
    loading, 
    error, 
    retry 
}: ProblemsListProps) {
    const { viewMode, setViewMode } = useProblemsViewMode()

    const handleProblemClick = (problemId: string) => {
        // TODO: Navigate to problem detail page
        console.log('Navigate to problem:', problemId)
    }

    return (
        <LoadingState
            loading={loading}
            error={error}
            empty={!loading && problems.length === 0}
            emptyMessage="No problems found. Try adjusting your filters or search terms."
            emptyAction={{
                label: 'Clear Filters',
                onClick: () => {
                    // TODO: Clear all filters
                    console.log('Clear filters')
                }
            }}
            retry={retry}
            skeleton={<ProblemsListSkeleton />}
        >
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
        </LoadingState>
    )
}