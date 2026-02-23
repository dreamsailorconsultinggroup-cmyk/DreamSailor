
"use client";

import { useEffect, useState } from "react";

// DTOs
export interface AddApplicantDto {
  jobPostId: string;
  resume: File;
  fullname: string;
  contactNo: string;
  email: string;
  highestEducation: string;
  address: string;
  url?: string;
}

export interface ViewApplicantDto {
  applicantId: string;
  jobPostId: string;
  fileName: string;
  fullname: string;
  contactNo: string;
  email: string;
  highestEducation: string;
  address: string;
  appliedDate: string;
  url?: string;
}

export interface ApplicantFilterDto {
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedList<T> {
  items: T[];
  currentPageNum: number;
  totalPages: number;
  totalCount: number;
  pageTotal: number;
  prevPageNum: number;
  nextPageNum: number;
  hasPrevious: boolean;
  hasNextPage: boolean;
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

export const useJobApplicantService = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Initialize token from localStorage on client-side
    setToken(sessionStorage.getItem("auth-token"));
  }, []);

  const addApplicant = async (applicantDto: AddApplicantDto): Promise<SuccessApiResponse<string>> => {
    try {
      const formData = new FormData();
      formData.append('jobPostId', applicantDto.jobPostId);
      formData.append('resume', applicantDto.resume);
      formData.append('fullname', applicantDto.fullname);
      formData.append('contactNo', applicantDto.contactNo);
      formData.append('email', applicantDto.email);
      formData.append('highestEducation', applicantDto.highestEducation);
      formData.append('address', applicantDto.address);
      formData.append('url', applicantDto.url || '');

      // Headers object for the request
      const headers: HeadersInit = {};
      
      // Only include auth token if available (not required for job applications)
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant`, {
        method: "POST",
        headers,
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to add applicant");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add applicant");
    }
  };

  const getAllApplicants = async (filterDto?: ApplicantFilterDto): Promise<SuccessApiResponse<PaginatedList<ViewApplicantDto>>> => {
    if (!token) throw new Error("No authentication token available. Please log in first.");
    
    try {
      const params = new URLSearchParams();
      if (filterDto) {
        params.append('pageNumber', filterDto.pageNumber.toString());
        params.append('pageSize', filterDto.pageSize.toString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to fetch applicants");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch applicants");
    }
  };

  const getApplicantById = async (id: string): Promise<SuccessApiResponse<ViewApplicantDto>> => {
    if (!token) throw new Error("No authentication token available. Please log in first.");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to fetch applicant");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch applicant");
    }
  };

  const getApplicantsByJobId = async (jobId: string): Promise<SuccessApiResponse<ViewApplicantDto[]>> => {
    if (!token) throw new Error("No authentication token available. Please log in first.");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant/job/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to fetch applicants for job");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch applicants for job");
    }
  };

  const downloadResume = async (applicantId: string): Promise<SuccessApiResponse<{ fileName: string; bytes: string }>> => {
    if (!token) throw new Error("No authentication token available. Please log in first.");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant/resume/${applicantId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to download resume");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to download resume");
    }
  };

  const deleteApplicant = async (applicantId: string): Promise<SuccessApiResponse<object>> => {
    if (!token) throw new Error("No authentication token available. Please log in first.");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant/${applicantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errorMessage || "Failed to delete applicant");
      }
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete applicant");
    }
  };

  return { 
    addApplicant,
    getAllApplicants, 
    getApplicantById, 
    getApplicantsByJobId,
    downloadResume,
    deleteApplicant, 
    token 
  };
};