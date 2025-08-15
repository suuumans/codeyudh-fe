import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, Code2, Trophy } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 relative overflow-hidden">
      {/* Background Elements - Fixed positioning to prevent overflow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-10 left-4 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-10 right-4 md:right-10 w-32 h-32 md:w-40 md:h-40 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Ready to level up your coding skills?
          </Badge>
          
          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-bold">
            Start your competitive programming
            <span className="block bg-gradient-to-r from-primary via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              journey today
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who are already improving their skills, solving challenging problems, and advancing their careers with CodeYudh.
          </p>
          
          {/* Features Highlight */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span>1000+ Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Weekly Contests</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="text-lg font-semibold group px-8">
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg font-semibold">
              <Link to="/problems">
                Explore Problems
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              Trusted by developers at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-bold">Google</div>
              <div className="text-lg font-bold">Microsoft</div>
              <div className="text-lg font-bold">Amazon</div>
              <div className="text-lg font-bold">Meta</div>
              <div className="text-lg font-bold">Apple</div>
            </div>
          </div>
          
          {/* Bottom Note */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              No credit card required • Start solving problems in under 60 seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}