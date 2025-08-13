import type { ProblemFilters, ProblemDifficulty } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
    Collapsible, 
    CollapsibleContent, 
    CollapsibleTrigger 
} from '@/components/ui/collapsible'
// Select components removed as they're not used in current implementation
import { ChevronDown, Filter, X } from 'lucide-react'
import { useFilterPanel } from '@/hooks/useUIStore'

interface FilterPanelProps {
    filters: ProblemFilters
    onFiltersChange: (filters: ProblemFilters) => void
    availableTopics?: string[]
}

const difficulties: ProblemDifficulty[] = ['easy', 'medium', 'hard']
const statusOptions = [
    { value: 'not_attempted', label: 'Not Attempted' },
    { value: 'attempted', label: 'Attempted' },
    { value: 'solved', label: 'Solved' },
] as const

const defaultTopics = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 
    'Math', 'Sorting', 'Greedy', 'Depth-First Search',
    'Binary Search', 'Tree', 'Breadth-First Search', 'Two Pointers',
    'Stack', 'Heap', 'Graph', 'Sliding Window'
]

export function FilterPanel({ 
    filters, 
    onFiltersChange, 
    availableTopics = defaultTopics 
}: FilterPanelProps) {
    const { isOpen, setOpen } = useFilterPanel()

    const updateFilters = (key: keyof ProblemFilters, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        })
    }

    const toggleDifficulty = (difficulty: ProblemDifficulty) => {
        const currentDifficulties = filters.difficulty || []
        const newDifficulties = currentDifficulties.includes(difficulty)
            ? currentDifficulties.filter(d => d !== difficulty)
            : [...currentDifficulties, difficulty]
        
        updateFilters('difficulty', newDifficulties.length > 0 ? newDifficulties : undefined)
    }

    const toggleTopic = (topic: string) => {
        const currentTopics = filters.topics || []
        const newTopics = currentTopics.includes(topic)
            ? currentTopics.filter(t => t !== topic)
            : [...currentTopics, topic]
        
        updateFilters('topics', newTopics.length > 0 ? newTopics : undefined)
    }

    const toggleStatus = (status: 'not_attempted' | 'attempted' | 'solved') => {
        const currentStatuses = filters.status || []
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter(s => s !== status)
            : [...currentStatuses, status]
        
        updateFilters('status', newStatuses.length > 0 ? newStatuses : undefined)
    }

    const clearAllFilters = () => {
        onFiltersChange({})
    }

    const getActiveFilterCount = () => {
        let count = 0
        if (filters.difficulty?.length) count += filters.difficulty.length
        if (filters.topics?.length) count += filters.topics.length
        if (filters.status?.length) count += filters.status.length
        return count
    }

    const activeFilterCount = getActiveFilterCount()

    return (
        <div className="space-y-4">
            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between">
                <Collapsible open={isOpen} onOpenChange={setOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {activeFilterCount}
                                </Badge>
                            )}
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-4 space-y-4">
                        <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
                            {/* Difficulty Filter */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Difficulty</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {difficulties.map((difficulty) => (
                                        <div key={difficulty} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`difficulty-${difficulty}`}
                                                checked={filters.difficulty?.includes(difficulty) || false}
                                                onCheckedChange={() => toggleDifficulty(difficulty)}
                                            />
                                            <label
                                                htmlFor={`difficulty-${difficulty}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                                            >
                                                {difficulty}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Status</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {statusOptions.map((status) => (
                                        <div key={status.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`status-${status.value}`}
                                                checked={filters.status?.includes(status.value) || false}
                                                onCheckedChange={() => toggleStatus(status.value)}
                                            />
                                            <label
                                                htmlFor={`status-${status.value}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {status.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Topics Filter */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Topics</h4>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                    {availableTopics.map((topic) => (
                                        <div key={topic} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`topic-${topic}`}
                                                checked={filters.topics?.includes(topic) || false}
                                                onCheckedChange={() => toggleTopic(topic)}
                                            />
                                            <label
                                                htmlFor={`topic-${topic}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {topic}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="w-fit"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.difficulty?.map((difficulty) => (
                        <Badge
                            key={`diff-${difficulty}`}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {difficulty}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => toggleDifficulty(difficulty)}
                            />
                        </Badge>
                    ))}
                    {filters.status?.map((status) => (
                        <Badge
                            key={`status-${status}`}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {statusOptions.find(s => s.value === status)?.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => toggleStatus(status)}
                            />
                        </Badge>
                    ))}
                    {filters.topics?.map((topic) => (
                        <Badge
                            key={`topic-${topic}`}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {topic}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => toggleTopic(topic)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}