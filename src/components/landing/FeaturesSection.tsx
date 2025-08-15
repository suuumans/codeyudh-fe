import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Trophy, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Palette, 
  Globe,
  BookOpen,
  Target,
  Clock,
  Award
} from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: "Smart Code Editor",
    description: "Advanced Monaco editor with syntax highlighting, auto-completion, and multiple language support.",
    badge: "Enhanced",
    color: "text-blue-500"
  },
  {
    icon: Trophy,
    title: "Live Contests",
    description: "Participate in weekly contests, climb leaderboards, and compete with developers worldwide.",
    badge: "Popular",
    color: "text-yellow-500"
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Detailed insights into your coding journey with performance metrics and skill tracking.",
    badge: "Pro",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with fellow coders, share solutions, and learn from the community.",
    badge: "Social",
    color: "text-purple-500"
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate results with our fast execution engine and detailed test case analysis.",
    badge: "Fast",
    color: "text-orange-500"
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Enterprise-grade security with encrypted data and secure code execution environment.",
    badge: "Secure",
    color: "text-red-500"
  },
  {
    icon: Palette,
    title: "Beautiful UI",
    description: "Modern, accessible interface with dark/light themes and responsive design.",
    badge: "Design",
    color: "text-pink-500"
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Available worldwide with CDN optimization and multi-language support.",
    badge: "Global",
    color: "text-cyan-500"
  }
]

const stats = [
  {
    icon: BookOpen,
    value: "1000+",
    label: "Coding Problems",
    description: "Curated from top platforms"
  },
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
    description: "Growing community"
  },
  {
    icon: Target,
    value: "95%",
    label: "Success Rate",
    description: "Problem solving accuracy"
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Uptime",
    description: "Always available"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to excel in
            <span className="text-primary"> competitive programming</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform provides all the tools and resources you need to improve your coding skills and succeed in programming contests.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <feature.icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}