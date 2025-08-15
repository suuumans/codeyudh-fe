import { createFileRoute } from '@tanstack/react-router'
import { 
  HeroSection, 
  FeaturesSection, 
  TestimonialsSection, 
  PricingSection, 
  CTASection, 
  Footer 
} from '@/components/landing'

function LandingPage() {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <PricingSection />
            <CTASection />
            <Footer />
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: LandingPage,
})
