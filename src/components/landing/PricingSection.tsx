import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { Check, Star, Zap, Crown } from 'lucide-react'

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with competitive programming",
    icon: Star,
    popular: false,
    features: [
      "Access to 500+ problems",
      "Basic progress tracking",
      "Community discussions",
      "Standard code editor",
      "Email support"
    ],
    limitations: [
      "Limited contest participation",
      "Basic analytics only"
    ]
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious competitive programmers who want to excel",
    icon: Zap,
    popular: true,
    features: [
      "Access to 1000+ problems",
      "Advanced progress analytics",
      "Unlimited contest participation",
      "Premium code editor features",
      "Priority support",
      "Detailed solution explanations",
      "Performance comparisons",
      "Custom problem sets"
    ],
    limitations: []
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "Perfect for teams, schools, and organizations",
    icon: Crown,
    popular: false,
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "Custom contests creation",
      "Advanced team analytics",
      "Bulk user management",
      "White-label options",
      "Dedicated support",
      "Custom integrations"
    ],
    limitations: []
  }
]

export function PricingSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose your
            <span className="text-primary"> coding journey</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as you grow. All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105 bg-background' 
                  : 'border-0 bg-background/80 backdrop-blur-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.popular ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
                
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Button 
                  asChild 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                  size="lg"
                >
                  <Link to="/register">
                    {plan.name === 'Free' ? 'Get Started Free' : `Start ${plan.name} Plan`}
                  </Link>
                </Button>
                
                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {plan.name === 'Free' 
                      ? 'No credit card required' 
                      : '14-day free trial • Cancel anytime'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution for your organization?
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}