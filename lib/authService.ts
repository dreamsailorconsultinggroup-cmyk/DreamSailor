"use client"

import React from "react"

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

interface StoredAuthData {
  token: string
  expiresAt: number
}

class AuthService {
  private tokenKey = "auth-token"
  private userKey = "auth-user"
  private expirationKey = "auth-expiration"
  private sessionMode = true // Set to true to use sessionStorage instead of localStorage
  
  private get storage(): Storage {
    if (typeof window !== "undefined") {
      return this.sessionMode ? sessionStorage : localStorage
    }
    return null as unknown as Storage
  }

  // Get token from storage with expiration check
  getToken(): string | null {
    if (typeof window !== "undefined") {
      const tokenData = this.storage.getItem(this.tokenKey)
      const expirationTime = Number(this.storage.getItem(this.expirationKey) || '0')
      
      // Check if token has expired
      if (tokenData && expirationTime > 0) {
        if (Date.now() > expirationTime) {
          // Token expired, clear auth data
          this.logout()
          return null
        }
        return tokenData
      }
      return tokenData
    }
    return null
  }

  // Get user from storage
  getUser(): any | null {
    if (typeof window !== "undefined") {
      const user = this.storage.getItem(this.userKey)
      return user ? JSON.parse(user) : null
    }
    return null
  }

  // Check if user is authenticated with token expiration validation
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }
  
  // Get token expiration time
  getTokenExpiration(): number | null {
    if (typeof window !== "undefined") {
      const expiration = this.storage.getItem(this.expirationKey)
      return expiration ? Number(expiration) : null
    }
    return null
  }

  // Login function
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const loginUrl = "https://localhost:7103/api/auth/login"
    console.log("Attempting login to URL:", loginUrl)

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed:", errorText)
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }

      const data: LoginResponse = await response.json()
      console.log("Login response data:", data)

      // Store token and user data if login successful
      if (data.success && data.token) {
        if (typeof window !== "undefined") {
          console.log("Storing token in session storage:", data.token)
          
          // Set token expiration (4 hours from now)
          const expiresAt = Date.now() + (4 * 60 * 60 * 1000)
          
          // Store in sessionStorage instead of localStorage
          this.storage.setItem(this.tokenKey, data.token)
          this.storage.setItem(this.expirationKey, expiresAt.toString())
          
          // Create a basic user object if not provided
          const userData = data.user || { username: "admin" }
          this.storage.setItem(this.userKey, JSON.stringify(userData))
          console.log("Stored user data in session storage:", userData)
        }
      }

      return data
    } catch (error) {
      console.error("Login error in authService:", error)
      throw error
    }
  }

  // Logout function
  logout(): void {
    if (typeof window !== "undefined") {
      // Clear from both storage types to ensure clean state
      this.storage.removeItem(this.tokenKey)
      this.storage.removeItem(this.userKey)
      this.storage.removeItem(this.expirationKey)
      
      // Also clear from localStorage in case older data exists there
      if (this.sessionMode) {
        localStorage.removeItem(this.tokenKey)
        localStorage.removeItem(this.userKey)
      }
    }
  }

  // Set token manually (if needed)
  setToken(token: string, expirationHours: number = 4): void {
    if (typeof window !== "undefined") {
      const expiresAt = Date.now() + (expirationHours * 60 * 60 * 1000)
      this.storage.setItem(this.tokenKey, token)
      this.storage.setItem(this.expirationKey, expiresAt.toString())
    }
  }
}

// Export a single instance
export const authService = new AuthService()

// Custom hook for using auth service in React components
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [token, setToken] = React.useState<string | null>(null)
  const [user, setUser] = React.useState<any | null>(null)

  // Function to refresh auth state from localStorage
  const refreshAuthState = React.useCallback(() => {
    const currentToken = authService.getToken()
    const currentUser = authService.getUser()
    
    console.log("Refreshing auth state:", { currentToken, currentUser })
    
    setToken(currentToken)
    setUser(currentUser)
    setIsAuthenticated(!!currentToken)
  }, [])

  // Check auth status on mount
  React.useEffect(() => {
    refreshAuthState()
  }, [refreshAuthState])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials)

      if (response.success) {
        console.log("Login successful, refreshing auth state...")
        
        // Immediately refresh auth state - no delay needed
        refreshAuthState()
        
        // Also force a check of localStorage again after a small delay
        setTimeout(() => {
          console.log("Second auth state refresh after login...")
          refreshAuthState()
        }, 200)
      }

      return response
    } catch (error) {
      console.error("Login error in useAuth:", error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    token,
    user,
    login,
    logout,
    refreshAuthState
  }
}