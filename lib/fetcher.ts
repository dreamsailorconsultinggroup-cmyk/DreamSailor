"use client";

import { authService } from "./authService";
import { API_CONFIG } from "./api-config";

// Map to store in-flight requests to prevent duplicate requests
const inFlightRequests = new Map();

// Custom cache implementation
const apiCache = new Map();
const CACHE_TTL = 60000; // 1 minute cache TTL

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  cacheTime?: number; // Custom cache time in ms
  retries?: number;
  dedupe?: boolean;
}

/**
 * Enhanced fetcher utility for API requests with:
 * - Authentication token handling
 * - Request deduplication
 * - Caching with TTL
 * - Automatic retries
 * - Error handling
 */
export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    skipAuth = false,
    cacheTime = CACHE_TTL,
    retries = 1,
    dedupe = true,
    ...fetchOptions
  } = options;

  const isGet = !fetchOptions.method || fetchOptions.method === "GET";
  const fullUrl = url.startsWith("http") ? url : `${API_CONFIG.baseURL}${url}`;
  const cacheKey = `${fullUrl}-${JSON.stringify(fetchOptions.body || "")}`;

  // Return cached data for GET requests if available and not expired
  if (isGet && apiCache.has(cacheKey)) {
    const { data, timestamp } = apiCache.get(cacheKey);
    if (Date.now() - timestamp < cacheTime) {
      return data;
    }
    apiCache.delete(cacheKey); // Remove expired cache
  }

  // Check for duplicate in-flight requests (deduplication)
  if (isGet && dedupe && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // Prepare headers
  const headers = new Headers(fetchOptions.headers || {});
  
  // Set content type if not already set
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  // Add auth token if not skipped
  if (!skipAuth) {
    const token = authService.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Create the fetch promise with retries
  const fetchWithRetries = async (retriesLeft: number): Promise<T> => {
    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          // Token expired or invalid
          authService.logout();
          throw new Error("Authentication expired. Please log in again.");
        }

        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (isGet) {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      // Retry logic for network errors and 5xx responses
      if (retriesLeft > 0 && (error instanceof TypeError || (error instanceof Error && error.message.includes("500")))) {
        console.log(`Retrying request (${retriesLeft} retries left)...`);
        return fetchWithRetries(retriesLeft - 1);
      }
      throw error;
    } finally {
      // Clean up the in-flight request
      if (dedupe) {
        inFlightRequests.delete(cacheKey);
      }
    }
  };

  // Store the promise in the in-flight requests map
  const fetchPromise = fetchWithRetries(retries);
  if (isGet && dedupe) {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  return fetchPromise;
}

// Helper to invalidate cache for a specific endpoint or pattern
export function invalidateCache(urlPattern: string | RegExp): void {
  if (typeof urlPattern === "string") {
    // Exact match or prefix match
    apiCache.forEach((_, key) => {
      if (key.startsWith(urlPattern)) {
        apiCache.delete(key);
      }
    });
  } else {
    // RegExp match
    apiCache.forEach((_, key) => {
      if (urlPattern.test(key)) {
        apiCache.delete(key);
      }
    });
  }
}

// Clear entire cache
export function clearCache(): void {
  apiCache.clear();
}