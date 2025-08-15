import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Alex Chen",
    role: "Software Engineer at Google",
    avatar: "/avatars/alex.jpg",
    initials: "AC",
    rating: 5,
    content: "CodeYudh helped me prepare for technical interviews. The problem quality and explanations are outstanding. I landed my dream job at Google!",
    badge: "FAANG"
  },
  {
    name: "Sarah Johnson",
    role: "Competitive Programmer",
    avatar: "/avatars/sarah.jpg",
    initials: "SJ",
    rating: 5,
    content: "The contest environment is amazing. I've improved my ranking significantly since joining. The community is very supportive and helpful.",
    badge: "Expert"
  },
  {
    name: "Raj Patel",
    role: "CS Student at MIT",
    avatar: "/avatars/raj.jpg",
    initials: "RP",
    rating: 5,
    content: "Perfect platform for learning algorithms and data structures. The progress tracking keeps me motivated to solve problems daily.",
    badge: "Student"
  },
  {
    name: "Maria Garcia",
    role: "Senior Developer",
    avatar: "/avatars/maria.jpg",
    initials: "MG",
    rating: 5,
    content: "Clean interface, fast execution, and excellent problem categorization. This is now my go-to platform for coding practice.",
    badge: "Pro"
  },
  {
    name: "David Kim",
    role: "Tech Lead at Microsoft",
    avatar: "/avatars/david.jpg",
    initials: "DK",
    rating: 5,
    content: "I use CodeYudh to stay sharp with my coding skills. The analytics feature helps me identify areas for improvement.",
    badge: "Lead"
  },
  {
    name: "Emma Wilson",
    role: "Freelance Developer",
    avatar: "/avatars/emma.jpg",
    initials: "EW",
    rating: 5,
    content: "The best coding platform I've used. Great for both beginners and advanced programmers. Highly recommend!",
    badge: "Freelancer"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by developers
            <span className="text-primary"> worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of developers who have improved their coding skills and advanced their careers with CodeYudh.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-muted/30 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}