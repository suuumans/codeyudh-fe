import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Play, Star, Users, Code2, Trophy } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Floating Elements - Fixed positioning to prevent overflow */}
      <div className="absolute top-20 left-4 md:left-10 w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-4 md:right-20 w-24 h-24 md:w-32 md:h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-20 h-20 md:w-24 md:h-24 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Join 10,000+ developers improving their skills
          </Badge>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Master Competitive
            <span className="block bg-gradient-to-r from-primary via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Programming
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practice coding problems, compete in contests, and track your progress on the most modern platform for competitive programmers.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span>1000+ Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              <span>Active Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Weekly Contests</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="text-lg font-semibold group">
              <Link to="/register">
                Start Coding Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg font-semibold group">
              <Link to="/problems">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Browse Problems
              </Link>
            </Button>
          </div>
          
          {/* Demo Link */}
          <div className="pt-4">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/login">
                Already have an account? Sign in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}