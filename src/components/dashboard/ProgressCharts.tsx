import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserStatistics } from '@/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

interface ProgressChartsProps {
  statistics: UserStatistics
  weeklyProgress?: Array<{ date: string; solved: number }>
}

const DIFFICULTY_COLORS = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444',
}

export function ProgressCharts({ statistics, weeklyProgress }: ProgressChartsProps) {
  const difficultyData = [
    { name: 'Easy', value: statistics.easySolved, color: DIFFICULTY_COLORS.Easy },
    { name: 'Medium', value: statistics.mediumSolved, color: DIFFICULTY_COLORS.Medium },
    { name: 'Hard', value: statistics.hardSolved, color: DIFFICULTY_COLORS.Hard },
  ]

  const skillProgressData = [
    { skill: 'Arrays', solved: 15, total: 20 },
    { skill: 'Strings', solved: 12, total: 18 },
    { skill: 'Trees', solved: 8, total: 15 },
    { skill: 'Graphs', solved: 5, total: 12 },
    { skill: 'DP', solved: 3, total: 10 },
  ]

  // Mock weekly progress if not provided
  const defaultWeeklyProgress = [
    { date: 'Mon', solved: 2 },
    { date: 'Tue', solved: 1 },
    { date: 'Wed', solved: 3 },
    { date: 'Thu', solved: 0 },
    { date: 'Fri', solved: 2 },
    { date: 'Sat', solved: 4 },
    { date: 'Sun', solved: 1 },
  ]

  const progressData = weeklyProgress || defaultWeeklyProgress

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Difficulty Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Problems by Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Progress Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="solved" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skill Progress Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Progress by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillProgressData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax']} />
              <YAxis dataKey="skill" type="category" width={80} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'solved' ? `${value} solved` : `${value} total`,
                  name === 'solved' ? 'Solved' : 'Total'
                ]}
              />
              <Bar dataKey="total" fill="#e5e7eb" />
              <Bar dataKey="solved" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}