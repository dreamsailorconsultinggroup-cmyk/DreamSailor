import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section id="home" className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 animate-scale-in">
        <img
          src="/modern-corporate-building-skyline-at-sunset.jpg"
          alt="Corporate skyline"
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-primary/70 animate-fade-in"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-slide-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance animate-fade-in">
          Empowering Dreams, Creating Opportunities
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-100">
          Your trusted partner in real estate, recruitment, business management, education, and migration services. Bringing 2+ decades of combined experience in one roof.
        </p>
        <Button
          size="lg"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-3 animate-pulse-slow"
          onClick={() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}