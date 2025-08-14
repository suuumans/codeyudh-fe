import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import type { UserStatistics } from '@/types'
import { Calendar as CalendarIcon, Flame, Award } from 'lucide-react'
import { useCalendarSelection } from '@/hooks/useUIStore'

interface StreakCalendarProps {
    statistics: UserStatistics
    activityData?: Array<{ date: Date; count: number }>
}

// Mock achievements data
const mockAchievements = [
    { id: 1, title: 'First Problem Solved', description: 'Solved your first coding problem', earned: true, date: '2025-08-01' },
    { id: 2, title: '7-Day Streak', description: 'Maintained a 7-day solving streak', earned: true, date: '2025-08-07' },
    { id: 3, title: '30 Problems Solved', description: 'Solved 30 coding problems', earned: true, date: '2025-08-10' },
    { id: 4, title: 'Speed Demon', description: 'Solved a problem in under 30 seconds', earned: false },
    { id: 5, title: '100 Problems Solved', description: 'Solved 100 coding problems', earned: false },
    { id: 6, title: '30-Day Streak', description: 'Maintained a 30-day solving streak', earned: false },
]

export function StreakCalendar({ statistics, activityData }: StreakCalendarProps) {
    const { selectedDate, setSelectedDate } = useCalendarSelection()

    // Generate mock activity data for the last 90 days
    const generateActivityData = () => {
        const data = []
        const today = new Date()

        for (let i = 89; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)

            // Random activity with higher probability for recent dates
            const probability = i < 30 ? 0.7 : i < 60 ? 0.4 : 0.2
            const count = Math.random() < probability ? Math.floor(Math.random() * 3) + 1 : 0

            data.push({ date, count })
        }

        return data
    }

    const activity = activityData || generateActivityData()

    // Create a map for quick lookup
    const activityMap = new Map(
        activity.map(item => [item.date.toDateString(), item.count])
    )

    const modifiers = {
        active: (date: Date) => {
            const count = activityMap.get(date.toDateString()) || 0
            return count > 0
        },
        high: (date: Date) => {
            const count = activityMap.get(date.toDateString()) || 0
            return count >= 3
        },
        medium: (date: Date) => {
            const count = activityMap.get(date.toDateString()) || 0
            return count === 2
        },
        low: (date: Date) => {
            const count = activityMap.get(date.toDateString()) || 0
            return count === 1
        },
    }

    const modifiersStyles = {
        active: { backgroundColor: '#dcfce7' },
        high: { backgroundColor: '#16a34a', color: 'white' },
        medium: { backgroundColor: '#22c55e', color: 'white' },
        low: { backgroundColor: '#86efac' },
    }

    const earnedAchievements = mockAchievements.filter(a => a.earned)
    const unearnedAchievements = mockAchievements.filter(a => !a.earned)

    return (
        <div className="space-y-6">
            {/* Streak Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.currentStreak}</div>
                        <p className="text-xs text-muted-foreground">days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                        <Flame className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.maxStreak}</div>
                        <p className="text-xs text-muted-foreground">days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">problems solved</p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Calendar */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Activity Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            modifiers={modifiers}
                            modifiersStyles={modifiersStyles}
                            className="rounded-md border"
                        />

                        {/* Legend */}
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">Less</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 bg-muted rounded-sm" />
                                <div className="w-3 h-3 bg-green-200 rounded-sm" />
                                <div className="w-3 h-3 bg-green-400 rounded-sm" />
                                <div className="w-3 h-3 bg-green-600 rounded-sm" />
                            </div>
                            <span className="text-muted-foreground">More</span>
                        </div>

                        {selectedDate && (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    {selectedDate.toDateString()}: {activityMap.get(selectedDate.toDateString()) || 0} problems solved
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Achievements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Earned Achievements */}
                        <div>
                            <h4 className="font-medium mb-3 text-green-700 dark:text-green-400">
                                Earned ({earnedAchievements.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {earnedAchievements.map(achievement => (
                                    <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                                        <Award className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-green-800 dark:text-green-200">
                                                {achievement.title}
                                            </h5>
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                {achievement.description}
                                            </p>
                                            {achievement.date && (
                                                <p className="text-xs text-green-500 dark:text-green-500 mt-1">
                                                    Earned on {new Date(achievement.date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Unearned Achievements */}
                        <div>
                            <h4 className="font-medium mb-3 text-muted-foreground">
                                Locked ({unearnedAchievements.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {unearnedAchievements.map(achievement => (
                                    <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-muted">
                                        <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-muted-foreground">
                                                {achievement.title}
                                            </h5>
                                            <p className="text-sm text-muted-foreground">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}