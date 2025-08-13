import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

import { Code, Trophy, BarChart3, Users } from 'lucide-react'

function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Hero Section */}
            <section className="container flex flex-col items-center justify-center flex-1 py-16 px-4">
                <div className="max-w-3xl w-full text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 text-primary">
                        Welcome to <span className="text-cyan-500">CodeYudh</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-6">
                        Practice coding, compete in contests, and track your progress on a modern, beautiful platform for competitive programmers.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg font-semibold">
                            <Link to="/register">Get Started</Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="text-lg font-semibold">
                            <Link to="/login">Login</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card shadow">
                        <Code className="h-10 w-10 text-cyan-500 mb-2" />
                        <h3 className="text-xl font-semibold mb-1">Practice Problems</h3>
                        <p className="text-muted-foreground">Solve hundreds of curated coding problems with detailed solutions and explanations.</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card shadow">
                        <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
                        <h3 className="text-xl font-semibold mb-1">Contests</h3>
                        <p className="text-muted-foreground">Compete in regular contests, climb the leaderboard, and earn badges for your achievements.</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card shadow">
                        <BarChart3 className="h-10 w-10 text-green-500 mb-2" />
                        <h3 className="text-xl font-semibold mb-1">Track Progress</h3>
                        <p className="text-muted-foreground">Monitor your progress, maintain streaks, and analyze your strengths and weaknesses.</p>
                    </div>
                </div>
            </section>

            {/* Why CodeYudh Section */}
            <section className="container py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Why CodeYudh?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4">
                        <Users className="h-10 w-10 text-primary" />
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Community Driven</h4>
                            <p className="text-muted-foreground">Join a vibrant community of coders, share solutions, and learn together.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Trophy className="h-10 w-10 text-yellow-500" />
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Earn Achievements</h4>
                            <p className="text-muted-foreground">Unlock badges and celebrate your milestones as you grow your skills.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <BarChart3 className="h-10 w-10 text-green-500" />
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Detailed Analytics</h4>
                            <p className="text-muted-foreground">Get insights into your coding journey with detailed stats and charts.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Code className="h-10 w-10 text-cyan-500" />
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Modern UI & Experience</h4>
                            <p className="text-muted-foreground">Enjoy a fast, accessible, and beautiful interface with light/dark mode support.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t bg-background py-6 px-4 mt-auto">
                <div className="container flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm">
                    <div>
                        &copy; {new Date().getFullYear()} CodeYudh. All rights reserved.
                    </div>
                    <div className="mt-2 md:mt-0">
                        Made with <span className="text-cyan-500">&lt;/&gt;</span> by the CodeYudh Team
                    </div>
                </div>
            </footer>
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: LandingPage,
})
