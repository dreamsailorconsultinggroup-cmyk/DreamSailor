"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from "lucide-react"
import { useAuth } from '@/lib/AuthProvider'
import { apiService } from '@/lib/apiService'

// Custom hook to detect when an element is in view
function useInView(options = { threshold: 0.1 }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login, token } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      console.log("User already has token, redirecting to admin:", token)
      router.push("/admin/education")
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    // Basic validation
    if (!username.trim()) {
      setError("Username is required")
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    try {
      const response = await login({ username: username.trim(), password })
      console.log("Login response received:", response)
      
      if (response.success) {
        setSuccess(response.successMessage || "Login successful!")
        
        // Store token in apiService as well for immediate use
        if (response.token) {
          apiService.setToken(response.token)
        }
        
        // Wait a bit for auth state to be updated, then redirect
        setTimeout(() => {
          const sessionToken = sessionStorage.getItem("auth-token")
          const localToken = localStorage.getItem("auth-token")
          console.log("Before redirect - Token in sessionStorage:", sessionToken)
          console.log("Before redirect - Token in localStorage:", localToken)
          console.log("Before redirect - Token in state:", token)
          
          router.push("/admin")
        }, 500) // Reduced delay as we've improved token handling
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred"
      
      if (err instanceof Error) {
        errorMessage = err.message
      }
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('fetch')) {
        errorMessage = "Unable to connect to server. Please check if the backend is running."
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = "Invalid username or password"
      } else if (errorMessage.includes('404')) {
        errorMessage = "Login service not found."
      } else if (errorMessage.includes('500')) {
        errorMessage = "Server error. Please try again later."
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {(() => {
          const { ref, isVisible } = useInView()
          return (
            <div ref={ref} className={isVisible ? "animate-slide-up" : "opacity-0"}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-2xl font-bold text-center ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
                    Login to Dream Sailor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className={isVisible ? "animate-fade-in delay-100" : "opacity-0"}>
                        Username
                      </Label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground ${
                            isVisible ? "animate-pulse" : "opacity-0"
                          }`}
                        />
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          className={`pl-10 ${isVisible ? "animate-fade-in delay-200" : "opacity-0"}`}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className={isVisible ? "animate-fade-in delay-300" : "opacity-0"}>
                        Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground ${
                            isVisible ? "animate-pulse" : "opacity-0"
                          }`}
                        />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className={`pl-10 ${isVisible ? "animate-fade-in delay-400" : "opacity-0"}`}
                          required
                        />
                      </div>
                    </div>
                    {error && (
                      <Alert variant="destructive" className={isVisible ? "animate-fade-in delay-500" : "opacity-0"}>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className={isVisible ? "animate-fade-in delay-500" : "opacity-0"}>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className={`w-full bg-primary hover:bg-blue-900 text-white transition-all ${
                        isVisible ? "animate-pulse-slow" : "opacity-0"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )
        })()}
      </div>
    </div>
  )
}