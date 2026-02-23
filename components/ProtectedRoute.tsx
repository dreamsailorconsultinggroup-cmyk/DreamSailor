"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthProvider"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Check for token in both storage locations for extra reliability
      const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('auth-token') : null
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
      
      if (!sessionToken && !localToken) {
        console.log("No authentication token found, redirecting to login")
        router.replace("/login") // Use replace instead of push for cleaner navigation history
      }
    }
  }, [isAuthenticated, isLoading, router])
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) return null
  
  return <>{children}</>
}