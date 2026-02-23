"use client";

import { useState, useEffect } from "react";
import { apiService, ApiResponse } from "./apiService";

// Enums
export enum JobTypeEnum {
  Full_Time = 1,
  Part_Time = 2,
  Hybrid = 3,
  Remote = 4,
}

// DTOs
export interface AddJobPostDto {
  jobTitle: string;
  jobCompanyTitle?: string;
  jobLocation: string; 
  jobSalary?: string;
  jobSectorId?: string;
  jobType: JobTypeEnum;
  jobDescription: string;
  jobResponsibility: string;
  jobQualification: string;
}


export interface ViewJobPostDto {
  postId: string;
  jobTitle: string;
  companyTitle: string;
  salary?: number;
  jobType: JobTypeEnum;
  jobSector?: string;
  jobLocation?: string;
  jobDescription: string;
  jobResponsibility: string;
  jobQualification: string;
  createdAt: string;
  country?: string;
  urgent?: boolean;
  url?: string;
}

export interface JobPostFilterDto {
  pageNumber: number;
  pageSize: number;
  jobSectorId?: string;
  jobType?: JobTypeEnum;
  searchTerm?: string;
  Location?: string;
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

// === UTILITY: Convert JobTypeEnum → String (e.g. 1 → "Full_Time") ===
export const getJobTypeString = (jobType: JobTypeEnum): string => {
  const map: Record<JobTypeEnum, string> = {
    [JobTypeEnum.Full_Time]: "Full_Time",
    [JobTypeEnum.Part_Time]: "Part_Time",
    [JobTypeEnum.Hybrid]: "Hybrid",
    [JobTypeEnum.Remote]: "Remote",
  };
  return map[jobType];
};

// === UTILITY: Get human-readable label (for UI) ===
export const getJobTypeLabel = (jobType: JobTypeEnum): string => {
  switch (jobType) {
    case JobTypeEnum.Full_Time:
      return "Full Time";
    case JobTypeEnum.Part_Time:
      return "Part Time";
    case JobTypeEnum.Hybrid:
      return "Hybrid";
    case JobTypeEnum.Remote:
      return "Remote";
    default:
      return "Unknown";
  }
};

// === UTILITY: Options for Select dropdown ===
export const getJobTypeOptions = () => {
  return [
    { value: JobTypeEnum.Full_Time, label: "Full Time" },
    { value: JobTypeEnum.Part_Time, label: "Part Time" },
    { value: JobTypeEnum.Hybrid, label: "Hybrid" },
    { value: JobTypeEnum.Remote, label: "Remote" },
  ];
};

// === MAIN HOOK ===
export const useJobPostService = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(apiService.getToken());
  }, []);

  // === ADD JOB POST (SENDS STRING) ===
  const addJobPost = async (
    jobPostDto: AddJobPostDto
  ): Promise<SuccessApiResponse<string>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      // Transform jobType from enum (number) to string
      const payload = {
        ...jobPostDto,
        jobType: getJobTypeString(jobPostDto.jobType),
        jobSectorId:
          jobPostDto.jobSectorId === "none" ? undefined : jobPostDto.jobSectorId,
        jobSalary: jobPostDto.jobSalary || undefined,
      };

      const result = await apiService.post<string>("/api/jobPost", payload);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to add job post");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Job post added successfully",
        data: result.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to add job post");
    }
  };

  // === GET JOB POSTS (ADMIN) ===
  const getJobPostsAdmin = async (
    filterDto: JobPostFilterDto
  ): Promise<SuccessApiResponse<PaginatedList<ViewJobPostDto>>> => {
    try {
      const apiParams: Record<string, any> = {
        PageNumber: filterDto.pageNumber,
        PageSize: filterDto.pageSize,
      };

      if (filterDto.jobSectorId) {
        apiParams.JobSectorId = filterDto.jobSectorId;
      }

      if (filterDto.jobType !== undefined) {
        apiParams.JobType = filterDto.jobType;
      }

      if (filterDto.searchTerm) {
        const trimmedSearch = filterDto.searchTerm.trim();
        if (trimmedSearch.length > 0) {
          apiParams.SearchTerm = trimmedSearch;
        }
      }

      // ✅ Add location filter
      if (filterDto.Location) {
        apiParams.Location = filterDto.Location;
      }

      console.log("Fetching admin job posts with params:", apiParams);
      const result = await apiService.get<PaginatedList<ViewJobPostDto>>(
        "/api/admin/jobPosts",
        apiParams
      );
      console.log("API response:", result);

      if (!result.success) {
        if (result.errorMessage === "No records found") {
          return {
            success: true,
            successMessage: "No job posts found with the selected filters",
            data: {
              items: [],
              currentPageNum: filterDto.pageNumber,
              totalPages: 0,
              totalCount: 0,
              pageTotal: 0,
              prevPageNum: filterDto.pageNumber,
              nextPageNum: filterDto.pageNumber,
              hasPrevious: false,
              hasNextPage: false,
            },
          };
        }

        throw new Error(result.errorMessage || "Failed to fetch job posts");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Job posts fetched successfully",
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in getJobPostsAdmin:", error);
      throw new Error(error.message || "Failed to fetch job posts");
    }
  };

  // === GET JOB POSTS (PUBLIC) ===
  const getJobPosts = async (
    filterDto: JobPostFilterDto
  ): Promise<SuccessApiResponse<PaginatedList<ViewJobPostDto>>> => {
    try {
      const apiParams: Record<string, any> = {
        PageNumber: filterDto.pageNumber,
        PageSize: filterDto.pageSize,
      };

      if (filterDto.jobSectorId) {
        apiParams.JobSectorId = filterDto.jobSectorId;
      }

      if (filterDto.jobType !== undefined) {
        apiParams.JobType = filterDto.jobType;
      }

      if (filterDto.searchTerm) {
        const trimmedSearch = filterDto.searchTerm.trim();
        if (trimmedSearch.length > 0) {
          apiParams.SearchTerm = trimmedSearch;
        }
      }

      if (filterDto.Location) {
        apiParams.Location = filterDto.Location;
      }

      console.log("Fetching job posts with params:", apiParams);
      const result = await apiService.get<PaginatedList<ViewJobPostDto>>(
        "/api/jobPosts",
        apiParams
      );
      console.log("API response:", result);

      if (!result.success) {
        if (result.errorMessage === "No records found") {
          return {
            success: true,
            successMessage: "No job posts found with the selected filters",
            data: {
              items: [],
              currentPageNum: filterDto.pageNumber,
              totalPages: 0,
              totalCount: 0,
              pageTotal: 0,
              prevPageNum: filterDto.pageNumber,
              nextPageNum: filterDto.pageNumber,
              hasPrevious: false,
              hasNextPage: false,
            },
          };
        }

        throw new Error(result.errorMessage || "Failed to fetch job posts");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Job posts fetched successfully",
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in getJobPosts:", error);
      throw new Error(error.message || "Failed to fetch job posts");
    }
  };

  // === GET SINGLE JOB POST ===
  const getJobPostById = async (
    id: string
  ): Promise<SuccessApiResponse<ViewJobPostDto>> => {
    try {
      const result = await apiService.get<ViewJobPostDto>(`/api/jobPost/${id}`);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch job post");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Job post fetched successfully",
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in getJobPostById:", error);
      throw new Error(error.message || "Failed to fetch job post");
    }
  };

  // === DELETE JOB POST ===
  const deleteJobPost = async (
    id: string
  ): Promise<SuccessApiResponse<any>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      const result = await apiService.delete(`/api/jobPost/${id}`);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to delete job post");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Job post deleted successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete job post");
    }
  };

  // === GET ALL JOB LOCATIONS ===
  const getAllJobLocations = async (): Promise<SuccessApiResponse<string[]>> => {
    try {
      const result = await apiService.get<string[]>("/api/jobLocations");

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch job locations");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Job locations fetched successfully",
        data: result.data || [],
      };
    } catch (error: any) {
      console.error("Error in getAllJobLocations:", error);
      return {
        success: true,
        successMessage: "No locations available",
        data: [],
      };
    }
  };

  return {
    token,
    addJobPost,
    getJobPosts,
    getJobPostById,
    deleteJobPost,
    getJobPostsAdmin,
    getAllJobLocations,
  };
};