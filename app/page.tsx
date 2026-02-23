"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutTestimonialsSection } from "@/components/about-testimonials-section"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Gavel, FileText, LogIn, Calendar, Home, Briefcase, GraduationCap, Plane, Badge, Users, Globe, Lightbulb } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Custom hook to detect when an element is in view
function useInView(options = { threshold: 0.1 }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Optionally stop observing after first intersection
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      options
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return { ref, isVisible }
}

export default function HomePage() {
  const { toast } = useToast();
  
  const services = [
    {
      title: "Land & Homes",
      description: "Discover premium real estate opportunities tailored to your needs.",
      link: "/land-homes",
      comingSoon: false,
      icon: <Home className="h-6 w-6" />,
    },
    {
      title: "Recruitment & Placements",
      description: "Connect with top employers for your next career opportunity.",
      link: "/recruitment",
      comingSoon: false,
      icon: <Briefcase className="h-6 w-6" />,
    },
    {
      title: "Business & Events",
      description: "Join exclusive conferences and networking events to grow your network.",
      link: "/business-events",
      comingSoon: false,
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Education & Counselling",
      description: "Unlock your potential with expert educational guidance.",
      link: "/education",
      comingSoon: false,
      icon: <GraduationCap className="h-6 w-6" />,
    },
    {
      title: "Visa & Migration",
      description: "Navigate visas and migration with our expert support.",
      link: "/visa-migration",
      comingSoon: false,
      icon: <Plane className="h-6 w-6" />,
    }
  ]

  const reasons = [
    {
      title: "Experienced Team",
      description: "We have 2 decades of combined experience in hospitality management and consulting.",
    },
    {
      title: "Expert Advice",
      description: "Our consulting and management process is based upon our real world experiences.",
    },
    {
      title: "Worldwide Partners",
      description: "We have partners worldwide fulfilling needs of international hospitality customers.",
    },
  ]

  const clientLogos = [
    "/cube.png",
    "/british-coffee.png",
    "/white.png",
    "/ginkgo.png",
    "/seamax.png",
    "/phca.png",
    "/pacific.png",
    "/one.png",
    "/mugs.png",
    "/konich.png",
    "/jamocha.png",
    "/eba.png",
    "/azizz.png",
  ]

  const whyChooseUsBenefits = [
    {
      icon: <Gavel className="h-6 w-6 text-primary animate-pulse" />,
      title: "Legal Immigration & Consulting Success",
      description: "Achieve your dream of legal immigration success with our expert guidance and support",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary animate-pulse" />,
      title: "Required Documents Support",
      description: "Get comprehensive support for all required documents with our expert assistance.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header className="animate-fade-in" />
      <main>
        <HeroSection className="animate-slide-up" />
        
        <section id="welcome" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="lg:w-1/2 w-full">
              {(() => {
                const { ref, isVisible } = useInView()
                return (
                  <div ref={ref} className={isVisible ? "animate-slide-right" : "opacity-0"}>
                    <h2 className={`text-3xl text-center sm:text-4xl font-bold text-foreground mb-4 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
                      Welcome to Dream Sailor Consulting
                    </h2>
                    <p className={`text-lg text-center text-muted-foreground mb-6 text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                      One Stop for Career & Business Growth
                    </p>
                    <p className={`text-lg text-justify text-muted-foreground text-pretty ${isVisible ? "animate-fade-in delay-200" : "opacity-0"}`}>
                      Dream Sailor Consulting is a multidisciplinary consulting firm built on experience, trust, and results. With over 20+ years of combined expertise, we support individuals and businesses across education, business management, real estate, recruitment, and migration services. <br /><br />Our approach goes beyond traditional career consulting. We work closely with clients to understand their vision, align strategies, and provide end-to-end support that helps them grow, expand globally, and make confident decisions for the future.<br /><br />At Dream Sailor Consulting, we don’t just guide journeys — we sail dreams together.
                    </p>
                  </div>
                )
              })()}
            </div>
          </div>
        </section>
        <section id="services" className="py-20 bg-background">
          {(() => {
            const { ref, isVisible } = useInView()
            return (
              <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="text-center mb-12">
                  <h2 className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                    Our Services
                  </h2>
                  <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                    Explore our range of professional services designed to empower your dreams and create opportunities.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <div
                      key={service.title}
                      className={`bg-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl group ${
                        isVisible ? "animate-slide-up" : "opacity-0"
                      }`}
                      style={{ animationDelay: isVisible ? `${index * 100}ms` : "0ms" }}
                    >
                      <div className="p-6 flex flex-col h-full group-hover:bg-[#1e40af] group-hover:text-white transition-all duration-300">
                        <div className="flex flex-col items-center text-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors duration-300">
                            <div className="text-primary group-hover:text-white transition-colors duration-300">
                              {service.icon}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold group-hover:text-white transition-colors duration-300">
                            {service.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-6 flex-grow text-center group-hover:text-white/90 transition-colors duration-300">
                          {service.description}
                        </p>
                        
                        <div className="text-center">
                          {service.comingSoon ? (
                            <button
                              className="inline-flex items-center text-sm font-medium text-primary group-hover:text-white transition-colors duration-300"
                            >
                              Coming Soon
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ) : (
                            <Link 
                              href={service.link}
                              className="inline-flex items-center text-sm font-medium text-primary group-hover:text-white transition-colors duration-300"
                            >
                              View More
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </section>
        
        {/* Book Consultation CTA Section */}
        <section id="book-consultation" className="py-16">
          {(() => {
            const { ref, isVisible } = useInView()
            return (
              <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="flex flex-col lg:flex-row items-stretch rounded-xl overflow-hidden shadow-lg max-w-5xl mx-auto">
                  {/* Image Side */}
                  <div className="lg:w-2/5 h-64 lg:h-auto relative">
                    <img 
                      src="/Call_Center_Image.jpeg" 
                      alt="Book a Consultation" 
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/welcome.png"; // Fallback image if the specified one doesn't exist
                      }}
                    />
                  </div>
                  
                  {/* Content Side - Using the blue background for the entire right side */}
                  <div className="lg:w-3/5 p-8 lg:p-12 bg-[#1e40af] text-white flex flex-col justify-center">
                    <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                      Ready to Start Your Journey?
                    </h2>
                    <p className={`text-base sm:text-lg text-white/90 mb-8 ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                      Schedule a free consultation with our experts and take the first step toward achieving your dreams.
                      Our team is ready to provide personalized guidance for your specific needs.
                    </p>
                    <Button 
                      asChild
                      size="lg" 
                      className={`bg-white hover:bg-white/90 text-[#1e40af] font-medium px-7 py-6 rounded-lg flex items-center justify-center gap-2 w-fit ${isVisible ? "animate-pulse-slow" : "opacity-0"}`}
                    >
                      <Link href="/book-consultation">
                        <Calendar className="mr-2 h-5 w-5" /> Book a Consultation
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })()}
        </section>
        
        <section id="reasons" className="py-20 bg-background">
          {(() => {
            const { ref, isVisible } = useInView()
            return (
              <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="text-center mb-16">
                  <span className={`inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
                    Why Choose Dream Sailor
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-bold text-foreground mb-6 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                    Our Commitment to Excellence
                  </h2>
                  <p className="max-w-2xl mx-auto text-muted-foreground">
                    We bring together expertise, innovation, and global connections to deliver exceptional results for all our clients.
                  </p>
                </div>
                
                <div className="space-y-16">
                  {/* Reason 1: Experienced Team - Horizontal Layout */}
                  <div className={`flex flex-col md:flex-row gap-8 items-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} 
                       style={{ animationDelay: isVisible ? "100ms" : "0ms" }}>
                    <div className="md:w-1/3">
                      <div className="relative aspect-square w-60 mx-auto">
                        <div className="absolute inset-4 rounded-full bg-primary/5 border border-primary/10 overflow-hidden z-10">
                          <div className="absolute inset-0">
                            <Image 
                              src="/Experienced_Team.jpg" 
                              alt="Experienced Team" 
                              fill 
                              className="object-cover object-center"
                              priority
                              sizes="(max-width: 768px) 100vw, 200px"
                            />
                          </div>
                        </div>
                        <div className="absolute top-12 right-0 h-10 w-10 rounded-full bg-primary/70 flex items-center justify-center z-20">
                          <span className="text-xs font-bold text-white">20+</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="bg-background p-6 rounded-lg border border-border/30">
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                          <span className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs text-primary font-bold">1</span>
                          </span>
                          Experienced Team
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Our team brings over two decades of combined experience in hospitality management and consulting. 
                          We leverage this expertise to provide strategic guidance, innovative solutions, and exceptional 
                          service tailored to your specific needs.
                        </p>
                        <div className="flex items-center text-sm text-primary font-medium">
                          <span className="mr-2">Learn more about our experts</span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reason 2: Expert Advice - Horizontal Layout Reversed */}
                  <div className={`flex flex-col md:flex-row-reverse gap-8 items-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} 
                       style={{ animationDelay: isVisible ? "200ms" : "0ms" }}>
                    <div className="md:w-1/3">
                      <div className="relative aspect-square w-60 mx-auto">
                        <div className="absolute inset-4 rounded-full bg-primary/5 border border-primary/10 overflow-hidden z-10">
                          <div className="absolute inset-0">
                            <Image 
                              src="/Expert_Advice.jpg" 
                              alt="Expert Advice" 
                              fill 
                              className="object-cover object-center"
                              priority
                              sizes="(max-width: 768px) 100vw, 200px"
                            />
                          </div>
                        </div>
                        <div className="absolute top-12 left-0 h-10 w-10 rounded-full bg-primary/70 flex items-center justify-center z-20">
                          <span className="text-xs font-bold text-white">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="bg-background p-6 rounded-lg border border-border/30">
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                          <span className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs text-primary font-bold">2</span>
                          </span>
                          Expert Advice
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Our consulting approach draws from real-world experience, combining practical knowledge with 
                          data-driven insights. We take the time to understand your unique challenges and develop 
                          tailored strategies that deliver measurable results for your hospitality business.
                        </p>
                        <div className="flex items-center text-sm text-primary font-medium">
                          <span className="mr-2">See our methodology</span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reason 3: Worldwide Partners - Horizontal Layout */}
                  <div className={`flex flex-col md:flex-row gap-8 items-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} 
                       style={{ animationDelay: isVisible ? "300ms" : "0ms" }}>
                    <div className="md:w-1/3">
                      <div className="relative aspect-square w-60 mx-auto">
                        <div className="absolute inset-4 rounded-full bg-primary/5 border border-primary/10 overflow-hidden z-10">
                          <div className="absolute inset-0">
                            <Image 
                              src="/WorldWide_Advise.jpg" 
                              alt="Worldwide Partners" 
                              fill 
                              className="object-cover object-center"
                              priority
                              sizes="(max-width: 768px) 100vw, 200px"
                            />
                          </div>
                        </div>
                        <div className="absolute top-12 right-0 h-10 w-10 rounded-full bg-primary/70 flex items-center justify-center z-20">
                          <span className="text-xs font-bold text-white">30+</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="bg-background p-6 rounded-lg border border-border/30">
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                          <span className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs text-primary font-bold">3</span>
                          </span>
                          Worldwide Partners
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Our extensive network of global partners allows us to offer seamless hospitality solutions 
                          worldwide. Whether you're operating in established markets or expanding to new territories, 
                          our international connections provide the local expertise you need for global success.
                        </p>
                        <div className="flex items-center text-sm text-primary font-medium">
                          <span className="mr-2">Explore our global network</span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stats Section */}
                {/* Achievements Stats - Transparent Background Design */}
                <div className={`mt-28 mb-10 relative ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} 
                     style={{ animationDelay: isVisible ? "400ms" : "0ms" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>
                  <div className="relative text-center">
                    <span className="bg-background px-6 text-xl font-medium">Our Impact</span>
                  </div>
                </div>
                
                <div className={`flex flex-wrap justify-center gap-20 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} 
                     style={{ animationDelay: isVisible ? "500ms" : "0ms" }}>
                  <div className="flex flex-col items-center group">
                    <div className="mb-3">
                      <span className="text-5xl font-bold text-primary">20+</span>
                    </div>
                    <p className="text-base font-medium">Years of Experience</p>
                  </div>
                  
                  <div className="flex flex-col items-center group">
                    <div className="mb-3">
                      <span className="text-5xl font-bold text-primary">500+</span>
                    </div>
                    <p className="text-base font-medium">Successful Projects</p>
                  </div>
                  
                  <div className="flex flex-col items-center group">
                    <div className="mb-3">
                      <span className="text-5xl font-bold text-primary">30+</span>
                    </div>
                    <p className="text-base font-medium">Countries Served</p>
                  </div>
                </div>
              </div>
            )
          })()}
        </section>
        <section id="why-choose-us" className="py-20 bg-background">
          {(() => {
            const { ref, isVisible } = useInView()
            return (
              <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="text-center mb-16">
                  <h2 className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                    Why Choose Dream Sailor
                  </h2>
                  <p className={`text-lg text-muted-foreground max-w-2xl mx-auto text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                    Countless Benefits & Easy Processing
                  </p>
                </div>
                <Card className={`max-w-4xl mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                  <CardContent className="p-6">
                    <p className={`text-muted-foreground mb-4 text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                      Dream Sailor Consulting is committed to provide complete services that are customized to meet your
                      needs. With their expertise in schooling, counselling, and migration, our team of experts guarantees a
                      seamless transfer and unwavering assistance throughout. Furthermore, you may get dependable and
                      customized help from our land and house services in locating the ideal property. You can rely on us to
                      provide outstanding outcomes while maintaining a dedication to quality and client pleasure. Select
                      Sailor Consulting to ensure a smooth and rewarding experience.
                    </p>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  {whyChooseUsBenefits.map((benefit, index) => (
                    <Card
                      key={index}
                      className={`hover:shadow-lg transition-shadow duration-300 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
                      style={{ animationDelay: isVisible ? `${index * 100}ms` : "0ms" }}
                    >
                      <CardHeader className="flex items-center">
                        <div className={isVisible ? "mr-4" : "mr-4 opacity-0"}>{benefit.icon}</div>
                        <CardTitle className={`text-xl ${isVisible ? "animate-fade-in" : "opacity-0"}`}>{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-sm text-muted-foreground text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })()}
        </section>
        <section id="clients" className="py-20 bg-muted/30">
          {(() => {
            const { ref, isVisible } = useInView()
            return (
              <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="text-center mb-16">
                  <h2 className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                    Industries We Cater To
                  </h2>
                  <p className={`text-lg text-muted-foreground max-w-2xl mx-auto text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                    Supporting diverse industries with tailored solutions.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center py-6">
                  <div className="flex flex-col items-center group">
                    <Briefcase className="h-16 w-16 text-primary group-hover:scale-110 group-hover:text-blue-700 transition-transform duration-300" />
                    <span className="text-sm text-muted-foreground mt-2">Business</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <GraduationCap className="h-16 w-16 text-primary group-hover:scale-110 group-hover:text-blue-700 transition-transform duration-300" />
                    <span className="text-sm text-muted-foreground mt-2">Education</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <Plane className="h-16 w-16 text-primary group-hover:scale-110 group-hover:text-blue-700 transition-transform duration-300" />
                    <span className="text-sm text-muted-foreground mt-2">Migration</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <Home className="h-16 w-16 text-primary group-hover:scale-110 group-hover:text-blue-700 transition-transform duration-300" />
                    <span className="text-sm text-muted-foreground mt-2">Real Estate</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <Users className="h-16 w-16 text-primary group-hover:scale-110 group-hover:text-blue-700 transition-transform duration-300" />
                    <span className="text-sm text-muted-foreground mt-2">Healthcare</span>
                  </div>
                  <div className="flex flex-col items-center group">
                    <Lightbulb className="h-16 w-16 text-primary group-hover:scale-110 group-hover:text-blue-700 transition-transform duration-300" />
                    <span className="text-sm text-muted-foreground mt-2">Technology</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </section>
        <section id="about" className="py-20 bg-background">
          {(() => {
            const { ref, isVisible } = useInView()
            return (
              <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
                <div className="text-center mb-16">
                  <h2 className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                    About Dream Sailor Consulting
                  </h2>
                  <p className={`text-lg text-muted-foreground max-w-2xl mx-auto text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                    Learn more about our mission and expertise.
                  </p>
                </div>
                <Card className={`max-w-4xl mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
                  <CardContent className="p-6 text-center">
                    <p className={`text-muted-foreground mb-4 text-pretty ${isVisible ? "animate-fade-in delay-100" : "opacity-0"}`}>
                      With 20+ years of combined experience, Dream Sailor Consulting brings together expertise across education, business management, real estate, immigration, recruitment, and multinational workforce solutions.
                    </p>
                    <p className={`text-muted-foreground mb-4 text-pretty ${isVisible ? "animate-fade-in delay-200" : "opacity-0"}`}>
                      Our team has successfully worked with individuals, startups, and global organizations, supporting career growth, business expansion, and cross-border opportunities. We specialize in recruitment with immigration support and business management solutions backed by real-world experience.
                    </p>
                    <p className={`text-muted-foreground mb-4 text-pretty ${isVisible ? "animate-fade-in delay-300" : "opacity-0"}`}>
                      We are confident, committed, and thrilled to represent your vision. Together, we don’t just plan the journey — we sail your dream forward.
                    </p>
                    <p className={`text-primary font-semibold italic ${isVisible ? "animate-fade-in delay-400" : "opacity-0"}`}>
                      "Train the Youth, Empower the Nation"
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          })()}
        </section>
        <AboutTestimonialsSection className="animate-fade-in-up" />

      </main>
      <Footer className="animate-fade-in" />
      <Toaster />
    </div>
  )
}