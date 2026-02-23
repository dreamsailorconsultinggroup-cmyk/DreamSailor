"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

interface AboutTestimonialsSectionProps {
  className?: string;
}

export function AboutTestimonialsSection({ className }: AboutTestimonialsSectionProps) {
  const testimonials = [
    {
      id: 1,
      name: "Smriti Rai",
      role: "Associate Cheg",
      company: "Bar Heather",
      image: "/professional-woman-headshot.png",
      rating: 5,
      text: "Dream Sailor Consulting Pty Ltd helped me find the perfect job opportunity abroad. Their recruitment team was professional and supportive throughout the entire process.",
    },
    {
      id: 2,
      name: "Roshan Chinal",
      role: "International Student",
      company: "University of Toronto",
      image: "/young-man-student-headshot.jpg",
      rating: 5,
      text: "The education counselling service was exceptional. They guided me through every step of my study abroad application and visa process.",
    },
    {
      id: 3,
      name: "Ayush Lamsal",
      role: "Property Investor",
      company: "Real Estate Portfolio",
      image: "/business-woman-professional-headshot.jpg",
      rating: 5,
      text: "I found my dream property through their real estate services. The team was knowledgeable and helped me make an informed investment decision.",
    },
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className={`py-20 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* About Us */}
          <div className="animate-slide-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 animate-fade-in">
              About Dream Sailor Consulting Pty Ltd
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-pretty animate-fade-in delay-100">
                For over a decade, Dream Sailor has been a trusted partner for individuals and families
                seeking new opportunities around the world. We specialize in real estate, recruitment, education, and
                migration services.
              </p>
              <p className="text-pretty animate-fade-in delay-200">
                Our team of experienced professionals is dedicated to providing personalized solutions that help our
                clients achieve their dreams. Whether you're looking for a new home, career opportunity, educational
                pathway, or migration assistance, we're here to guide you every step of the way.
              </p>
              <p className="text-pretty animate-fade-in delay-300">
                With a proven track record of success and thousands of satisfied clients worldwide, we continue to be
                the preferred choice for those seeking excellence in hospitality services.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div className="animate-slide-up">
                <div className="text-2xl font-bold text-primary mb-1 animate-fade-in">10,000+</div>
                <div className="text-sm text-muted-foreground animate-fade-in delay-100">Happy Clients</div>
              </div>
              <div className="animate-slide-up">
                <div className="text-2xl font-bold text-primary mb-1 animate-fade-in">15+</div>
                <div className="text-sm text-muted-foreground animate-fade-in delay-100">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="animate-slide-right">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center animate-fade-in">
              What Our Clients Say
            </h3>
            <Card className="relative overflow-hidden animate-slide-up">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4 animate-scale-in" />
                <div className="mb-6">
                  <div className="flex items-center mb-2 animate-fade-in">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-pretty mb-6 animate-fade-in delay-100">"{testimonials[currentTestimonial].text}"</p>
                </div>
                <div className="flex items-center animate-fade-in delay-200">
                  <img
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full mr-4 animate-scale-in"
                  />
                  <div>
                    <div className="font-semibold animate-fade-in">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-muted-foreground animate-fade-in delay-100">
                      {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-center mt-6 gap-4 animate-fade-in delay-300">
              <Button variant="outline" size="sm" onClick={prevTestimonial} className="animate-pulse-slow">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? "bg-primary" : "bg-muted"
                    } animate-scale-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={nextTestimonial} className="animate-pulse-slow">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}