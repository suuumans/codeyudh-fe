import { createFileRoute } from '@tanstack/react-router'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { SearchBar } from '@/components/problems/SearchBar'
import { FilterPanel } from '@/components/problems/FilterPanel'
import type { Problem, ProblemFilters } from '@/types'
import { useState, useEffect, useMemo } from 'react'
import { z } from 'zod'

// Search params schema for URL synchronization
const problemsSearchSchema = z.object({
    search: z.string().optional(),
    difficulty: z.array(z.enum(['easy', 'medium', 'hard'])).optional(),
    topics: z.array(z.string()).optional(),
    status: z.array(z.enum(['not_attempted', 'attempted', 'solved'])).optional(),
})



// Mock data for development - will be replaced with API calls
const mockProblems: Problem[] = [
    {
        id: '1',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'easy',
        topics: ['Array', 'Hash Table'],
        constraints: '2 <= nums.length <= 10^4',
        examples: [],
        testCases: [],
        acceptanceRate: 49.2,
        totalSubmissions: 8234567,
        createdAt: new Date('2023-01-01'),
    },
    {
        id: '2',
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers.',
        difficulty: 'medium',
        topics: ['Linked List', 'Math', 'Recursion'],
        constraints: 'The number of nodes in each linked list is in the range [1, 100].',
        examples: [],
        testCases: [],
        acceptanceRate: 38.7,
        totalSubmissions: 4567890,
        createdAt: new Date('2023-01-02'),
    },
    {
        id: '3',
        title: 'Median of Two Sorted Arrays',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        difficulty: 'hard',
        topics: ['Array', 'Binary Search', 'Divide and Conquer'],
        constraints: 'nums1.length == m, nums2.length == n',
        examples: [],
        testCases: [],
        acceptanceRate: 35.4,
        totalSubmissions: 2345678,
        createdAt: new Date('2023-01-03'),
    },
    {
        id: '4',
        title: 'Longest Palindromic Substring',
        description: 'Given a string s, return the longest palindromic substring in s.',
        difficulty: 'medium',
        topics: ['String', 'Dynamic Programming'],
        constraints: '1 <= s.length <= 1000',
        examples: [],
        testCases: [],
        acceptanceRate: 32.1,
        totalSubmissions: 3456789,
        createdAt: new Date('2023-01-04'),
    },
    {
        id: '5',
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'easy',
        topics: ['String', 'Stack'],
        constraints: '1 <= s.length <= 10^4',
        examples: [],
        testCases: [],
        acceptanceRate: 40.8,
        totalSubmissions: 5678901,
        createdAt: new Date('2023-01-05'),
    },
    {
        id: '6',
        title: 'Merge k Sorted Lists',
        description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
        difficulty: 'hard',
        topics: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'],
        constraints: 'k == lists.length',
        examples: [],
        testCases: [],
        acceptanceRate: 47.3,
        totalSubmissions: 1234567,
        createdAt: new Date('2023-01-06'),
    },
]

function ProblemsPage() {
    const navigate = Route.useNavigate()
    const search = Route.useSearch()
    const [allProblems, setAllProblems] = useState<Problem[]>([])
    const [loading, setLoading] = useState(true)

    // Convert search params to filters
    const filters: ProblemFilters = useMemo(() => ({
        search: search.search || '',
        difficulty: search.difficulty,
        topics: search.topics,
        status: search.status,
    }), [search])

    // Simulate API call
    useEffect(() => {
        const loadProblems = async () => {
            setLoading(true)
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            setAllProblems(mockProblems)
            setLoading(false)
        }

        loadProblems()
    }, [])

    // Filter problems based on current filters
    const filteredProblems = useMemo(() => {
        let filtered = [...allProblems]

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filtered = filtered.filter(problem =>
                problem.title.toLowerCase().includes(searchLower) ||
                problem.description.toLowerCase().includes(searchLower) ||
                problem.topics.some(topic => topic.toLowerCase().includes(searchLower))
            )
        }

        // Apply difficulty filter
        if (filters.difficulty?.length) {
            filtered = filtered.filter(problem =>
                filters.difficulty!.includes(problem.difficulty)
            )
        }

        // Apply topics filter
        if (filters.topics?.length) {
            filtered = filtered.filter(problem =>
                filters.topics!.some(topic => problem.topics.includes(topic))
            )
        }

        // Apply status filter (mock implementation - in real app this would come from user data)
        if (filters.status?.length) {
            // For demo purposes, randomly assign status to problems
            filtered = filtered.filter(problem => {
                const mockStatus = problem.id === '1' ? 'solved' : 
                                 problem.id === '2' ? 'attempted' : 'not_attempted'
                return filters.status!.includes(mockStatus)
            })
        }

        return filtered
    }, [allProblems, filters])

    const handleFilterChange = (newFilters: ProblemFilters) => {
        // Update URL search params
        navigate({
            search: {
                search: newFilters.search || undefined,
                difficulty: newFilters.difficulty?.length ? newFilters.difficulty : undefined,
                topics: newFilters.topics?.length ? newFilters.topics : undefined,
                status: newFilters.status?.length ? newFilters.status : undefined,
            },
        })
    }

    const handleSearchChange = (searchValue: string) => {
        handleFilterChange({
            ...filters,
            search: searchValue || undefined,
        })
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Problems</h1>
                <p className="text-muted-foreground">
                    Practice coding problems to improve your skills
                </p>
            </div>

            <div className="space-y-6">
                {/* Search and Filters */}
                <div className="space-y-4">
                    <SearchBar
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                        placeholder="Search problems by title, description, or topic..."
                    />
                    <FilterPanel
                        filters={filters}
                        onFiltersChange={handleFilterChange}
                    />
                </div>

                {/* Problems List */}
                <ProblemsList
                    problems={filteredProblems}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export const Route = createFileRoute('/problems')({
    component: ProblemsPage,
    validateSearch: problemsSearchSchema,
})
