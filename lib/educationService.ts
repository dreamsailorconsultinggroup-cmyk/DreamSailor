"use client";

import { useState, useEffect } from "react";

// DTOs matching backend
export interface ViewEduClientDto {
  eduCounselingId: string;
  resumeName: string;
  fullname: string;
  contactNo: string;
  email: string;
  highestCompletedEducation: string;
  address: string;
  appliedDate: string;
  preferredCountry: string;
  preferredEducationType: string;
  desiredCourse: string;
  additionalNote?: string;
}

export interface FilterEduClientDto {
  pageNumber?: number;
  pageSize?: number;
  searchName?: string;
  latest?: boolean;
  preferredCountry?: string;
  preferredEducationType?: string;
}

export interface PaginatedList<T> {
  currentPageNum: number;
  totalPages: number;
  totalCount: number;
  pageTotal: number;
  items: T[];
  prevPageNum?: number;
  nextPageNum?: number;
  hasPrevious?: boolean;
  hasNextPage?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  successMessage?: string;
  errorMessage?: string;
  data?: T;
}

// === MAIN HOOK ===
export const useEducationService = () => {
  const [token, setToken] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(sessionStorage.getItem("auth-token"));
    }
  }, []);

  const getAuthHeaders = (requireAuth = false): HeadersInit => {
    const authToken =
      typeof window !== "undefined" ? sessionStorage.getItem("auth-token") : null;

    if (requireAuth && !authToken) {
      throw new Error("Authentication required for this operation");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    return headers;
  };

  const buildQueryString = (params?: Record<string, any>): string => {
    if (!params) return "";

    const query = Object.entries(params)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    return query ? `?${query}` : "";
  };

  // ===================================
  // 🔹 Get all education clients
  // ===================================
  const getAllClients = async (
    filters?: FilterEduClientDto
  ): Promise<PaginatedList<ViewEduClientDto>> => {
    try {
      const queryString = buildQueryString(filters);
      const url = `${baseUrl}/api/education${queryString}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result: ApiResponse<PaginatedList<ViewEduClientDto>> =
        await response.json();

      if (!result.success) {
        if (result.errorMessage === "No records found") {
          return {
            items: [],
            currentPageNum: filters?.pageNumber || 1,
            totalPages: 0,
            totalCount: 0,
            pageTotal: 0,
            prevPageNum: filters?.pageNumber || 1,
            nextPageNum: filters?.pageNumber || 1,
            hasPrevious: false,
            hasNextPage: false,
          };
        }
        throw new Error(
          result.errorMessage || "Failed to fetch education clients"
        );
      }

      const data = result.data || {
        items: [],
        currentPageNum: 1,
        totalPages: 0,
        totalCount: 0,
        pageTotal: 0,
      };

      // Add pagination helpers
      return {
        ...data,
        prevPageNum: data.currentPageNum - 1,
        nextPageNum: data.currentPageNum + 1,
        hasPrevious: data.currentPageNum > 1,
        hasNextPage: data.currentPageNum < data.totalPages,
      };
    } catch (error: any) {
      console.error("Error in getAllClients:", error);
      throw new Error(error.message || "Failed to fetch education clients");
    }
  };

  // ===================================
  // 🔹 Get client by ID
  // ===================================
  const getClientById = async (
    clientId: string
  ): Promise<ViewEduClientDto> => {
    try {
      const url = `${baseUrl}/api/education/${clientId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result: ApiResponse<ViewEduClientDto> = await response.json();

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch client");
      }

      if (!result.data) {
        throw new Error("No client data received");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error in getClientById:", error);
      throw new Error(error.message || "Failed to fetch client");
    }
  };

  // ===================================
  // 🔹 Download resume
  // ===================================
  const downloadResume = async (
    clientId: string
  ): Promise<{ fileName: string; bytes: string }> => {
    try {
      const url = `${baseUrl}/api/education/resume/${clientId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(true),
      });

      const result: ApiResponse<{ fileName: string; bytes: string }> =
        await response.json();

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to download resume");
      }

      if (!result.data) {
        throw new Error("No file data received");
      }

      return result.data;
    } catch (error: any) {
      console.error("Error in downloadResume:", error);
      throw new Error(error.message || "Failed to download resume");
    }
  };

  // ===================================
  // 🔹 Delete client
  // ===================================
  const deleteClient = async (clientId: string): Promise<void> => {
    try {
      const url = `${baseUrl}/api/education/${clientId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(true),
      });

      const result: ApiResponse<string> = await response.json();

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to delete client");
      }
    } catch (error: any) {
      console.error("Error in deleteClient:", error);
      throw new Error(error.message || "Failed to delete client");
    }
  };

  // ===================================
  // 🔹 Download file from Base64
  // ===================================
  const downloadFileFromBase64 = (
    fileName: string,
    base64Data: string,
    mimeType: string = "application/octet-stream"
  ): void => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw new Error("Failed to download file");
    }
  };

  return {
    token,
    getAllClients,
    getClientById,
    downloadResume,
    deleteClient,
    downloadFileFromBase64,
  };
};