"use client";

import { API_BASE_URL } from "./api-config";

// Simple storage handler
const tokenStorage = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("auth-token");
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth-token", token);
    }
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth-token");
    }
  },
};

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  successMessage?: string;
  errorMessage?: string;
  errorDetails?: string[];
}

// Base API service
class ApiService {
  // Get token
  getToken() {
    return tokenStorage.getToken();
  }

  // Set token
  setToken(token: string) {
    tokenStorage.setToken(token);
  }

  // Clear token
  clearToken() {
    tokenStorage.removeToken();
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Create headers with authentication
  createHeaders(customHeaders?: Record<string, string>) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // GET request
  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      // Build URL with query parameters
      let url = `${API_BASE_URL}${endpoint}`;
      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      // Make request
      const response = await fetch(url, {
        method: "GET",
        headers: this.createHeaders(),
      });

      // Even for non-2xx responses, try to parse the JSON first
      // The server might return useful error information
      try {
        const result = await response.json();

        // If the server returned a JSON response, return it even for errors
        // This allows our error handling in jobPostService to work
        if (!response.ok) {
          if (
            response.status === 404 &&
            result.errorMessage === "No records found"
          ) {
            // Special case for "No records found" - return a properly structured response
            return {
              success: false,
              errorMessage: result.errorMessage,
              // Don't include data property at all rather than setting to null
            };
          }

          // For other errors, if we have JSON error details, include them
          if (result.errorMessage) {
            return {
              success: false,
              errorMessage: result.errorMessage,
              errorDetails: result.errorDetails,
            };
          }
        }

        return result;
      } catch (e) {
        // If JSON parsing fails, then throw the HTTP error
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        throw e; // Re-throw if it was a JSON parsing error with a successful response
      }
    } catch (error) {
      console.error(`Error in GET ${endpoint}:`, error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.createHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in POST ${endpoint}:`, error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: this.createHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in PUT ${endpoint}:`, error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: this.createHeaders(),
      });

      let result: ApiResponse<T> = { success: false };

      try {
        result = await response.json();
      } catch (jsonError) {
        console.error("Error parsing DELETE response JSON:", jsonError);
      }

      if (!response.ok) {
        // If server returned JSON with errorMessage, include it
        const errorMsg = result.errorMessage || `API error: ${response.status}`;
        return { success: false, errorMessage: errorMsg };
      }

      return result;
    } catch (error) {
      console.error(`Error in DELETE ${endpoint}:`, error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
