"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Define types to match authService
interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  successMessage?: string
  errorMessage?: string
  token?: string
  user?: any
  data?: {
    token: string
    user: any
  }
}

// Define auth context type
interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<LoginResponse>
  logout: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("auth-token")
    setToken(storedToken)
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://dsailorgroup.com.au'}/api/auth/login`

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          errorMessage: `Login failed: ${response.status} ${response.statusText}`
        }
      }

      const result = await response.json()

      // Extract token from response
      const token = result.token || result.data?.token
      if (token) {
        sessionStorage.setItem("auth-token", token) // Store token in sessionStorage only
        setToken(token)
        return {
          success: true,
          successMessage: "Login successful",
          token,
          user: result.user || result.data?.user
        }
      }

      return {
        success: false,
        errorMessage: "No token received from server"
      }
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error occurred"
      }
    }
  }

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("auth-token") // Clear token from sessionStorage
    setToken(null)
  }

  // Context value
  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}