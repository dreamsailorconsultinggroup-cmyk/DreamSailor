"use client";

import { useState, useEffect } from "react";
import { apiService, ApiResponse } from "./apiService";

interface AddJobSectorDto {
  jobSectorName: string;
}

interface ViewJobSectorDto {
  jobSectorId: string;
  jobSectorName: string;
}

interface SuccessApiResponse<T> {
  success: boolean;
  successMessage: string;
  data?: T;
}

interface ErrorApiResponse {
  success: false;
  errorMessage: string;
  errorDetails?: string[];
}

export const useJobSectorService = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Initialize token from our apiService
    setToken(apiService.getToken());
  }, []);

  const addJobSector = async (jobSectorName: string): Promise<SuccessApiResponse<string>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error("No authentication token available. Please log in first.");
    }
    
    try {
      const result = await apiService.post<string>('/api/addJobSector', { jobSectorName });
      
      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to add job sector");
      }
      
      return result as SuccessApiResponse<string>;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add job sector");
    }
  };

  const getJobSectors = async (): Promise<SuccessApiResponse<ViewJobSectorDto[]>> => {
    try {
      // For job sectors, we'll check authentication but proceed even if not authenticated
      // as this might be needed for public pages too
      
      const result = await apiService.get<ViewJobSectorDto[]>('/api/jobSectors');
      
      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch job sectors");
      }
      
      return result as SuccessApiResponse<ViewJobSectorDto[]>;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch job sectors");
    }
  };

  const getJobSectorById = async (id: string): Promise<SuccessApiResponse<ViewJobSectorDto>> => {
    try {
      // Headers object for the request
      const headers: HeadersInit = {
        accept: "*/*",
      };
      
      // Only include auth token if available (not required for viewing job sectors)
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobSector/${id}`, {
        method: "GET",
        headers,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to fetch job sector");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch job sector");
    }
  };

  const deleteJobSector = async (jobSectorId: string): Promise<SuccessApiResponse<object>> => {
    if (!token) throw new Error("No authentication token available. Please log in first.");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobSector/${jobSectorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to delete job sector");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete job sector");
    }
  };

  return { 
    addJobSector, 
    getJobSectors, 
    getJobSectorById, 
    deleteJobSector, 
    token 
  };
};