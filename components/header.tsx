"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOtherOpen, setIsOtherOpen] = useState(false)
  const isMobile = useIsMobile()
  
  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return
    const close = () => setIsMenuOpen(false)
    const timer = setTimeout(() => document.addEventListener("click", close), 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("click", close)
    }
  }, [isMenuOpen])

  const mainNavItems = [
    { name: "Home", href: "/" },
    { name: "Recruitment & Placements", href: "/recruitment" },
    { name: "Education & Counselling", href: "/education" },
    { name: "Visa & Migration", href: "/visa-migration" },
    { name: "Contact", href: "/contact" },
  ]

  const otherServices = [
    { name: "Land & Homes", href: "/land-homes" },
    { name: "Business & Events", href: "/business-events" }
  ]

  return (
    <header
      className={cn(
        `sticky top-0 z-50 backdrop-blur transition-all duration-300 ease-in-out border-b ${className}`,
        isScrolled ? "bg-background/95 shadow-md" : "bg-background/70"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="flex items-center justify-between h-18 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <div className="relative h-12 w-12 md:h-14 md:w-14">
              <Image
                src="/DreamSailor_Logo.png"
                alt="Dream Sailor Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center flex-1">
            <div className="flex items-baseline space-x-6">
              {mainNavItems.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-lg font-medium transition-colors"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}

              {/* Other Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOtherOpen(!isOtherOpen)}
                  className="flex items-center text-foreground hover:text-primary px-3 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  Other Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isOtherOpen && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-background/95 shadow-lg border rounded-md p-2 animate-fade-in"
                    onMouseLeave={() => setIsOtherOpen(false)}
                  >
                    {otherServices.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="block px-4 py-2 rounded-md hover:bg-secondary/20 text-foreground"
                        onClick={() => setIsOtherOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Desktop Book Button */}
          <div className="hidden md:block">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-medium">
              <Link href="/book-consultation">Book a Call</Link>
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center">
            <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90 text-primary mr-4">
              <Link href="/book-consultation">Book</Link>
            </Button>

            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden fixed inset-x-0 top-[72px] transition-all duration-300 z-50 border-t",
            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-[-100%] opacity-0 pointer-events-none"
          )}
        >
          <div className="px-4 pt-4 pb-6 space-y-3 bg-background/95 shadow-lg">
            {mainNavItems.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-lg font-medium hover:text-primary"
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Other Services - Mobile */}
            <div className="pt-3">
              <p className="text-sm font-semibold text-muted-foreground px-4">Other Services</p>

              {otherServices.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-primary font-medium py-6">
              <Link href="/book-consultation">Book a Call</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
