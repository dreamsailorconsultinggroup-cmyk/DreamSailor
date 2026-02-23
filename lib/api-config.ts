// API Configuration utilities

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    education: '/api/education',
    jobSectors: '/api/job-sectors',
    properties: '/api/properties',
    events: '/api/BusinessEvents',
    visa: '/api/visa',
    blogs: '/api/blogs',
    business : 'api/BusinessEvents',

  }
}

// Common API error handler
export function handleApiError(error: any): string {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.errorMessage || `HTTP ${error.response.status}: ${error.response.statusText}`
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error: Please check your connection and ensure the server is running'
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred'
  }
}

// Helper to build query parameters
export function buildQueryParams(params: Record<string, any>): string {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value))
    }
  })
  
  return queryParams.toString()
}

// Helper for fetch with error handling
export async function apiRequest<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  console.log('Making API request to:', url)
  console.log('Request options:', { ...options, headers: defaultHeaders })

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}