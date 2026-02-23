"use client";

import { useState, useEffect } from "react";
import { apiService } from "./apiService";

// ---------------------- TYPE DEFINITIONS ----------------------
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

interface Blog {
  blogId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

interface AddBlogDto {
  title: string;
  content: string;
  type: string;
}

interface UpdateBlogDto {
  title: string;
  content: string;
  type: string;
}

// ---------------------- SERVICE ----------------------
export const useBlogService = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(apiService.getToken());
  }, []);

  // === GET ALL BLOGS (PUBLIC) ===
  const getBlogs = async (): Promise<SuccessApiResponse<Blog[]>> => {
    try {
      const result = await apiService.get<Blog[]>("/api/blogs");

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch blogs");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Blogs fetched successfully",
        data: result.data || [],
      };
    } catch (error: any) {
      console.error("Error in getBlogs:", error);
      // Return empty array instead of throwing for better UX
      return {
        success: true,
        successMessage: "No blogs available",
        data: [],
      };
    }
  };

  // === GET BLOG BY ID (PUBLIC) ===
  const getBlogById = async (
    id: string
  ): Promise<SuccessApiResponse<Blog>> => {
    try {
      const result = await apiService.get<Blog>(`/api/blogs/${id}`);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch blog");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Blog fetched successfully",
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in getBlogById:", error);
      throw new Error(error.message || "Failed to fetch blog");
    }
  };

  // === GET BLOG BY SERVICE/TYPE (PUBLIC) ===
  const getBlogByService = async (
    service: string
  ): Promise<SuccessApiResponse<Blog[]>> => {
    try {
      const result = await apiService.get<Blog[]>(`/api/blogs/type/${service}`);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch blogs by type");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Blogs fetched successfully by type",
        data: result.data || [],
      };
    } catch (error: any) {
      console.error("Error in getBlogByService:", error);
      // Return empty array for better UX
      return {
        success: true,
        successMessage: "No blogs available for this type",
        data: [],
      };
    }
  };

  // === ADD BLOG (PROTECTED) ===
  const addBlog = async (
    blogDto: AddBlogDto
  ): Promise<SuccessApiResponse<string>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      const result = await apiService.post<string>("/api/blogs", blogDto);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to add blog");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Blog added successfully",
        data: result.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to add blog");
    }
  };

  // === UPDATE BLOG (PROTECTED) ===
  const updateBlog = async (
    id: string,
    blogDto: UpdateBlogDto
  ): Promise<SuccessApiResponse<string>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      const result = await apiService.put<string>(`/api/blogs/${id}`, blogDto);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to update blog");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Blog updated successfully",
        data: result.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update blog");
    }
  };

  // === DELETE BLOG (PROTECTED) ===
  const deleteBlog = async (
    id: string
  ): Promise<SuccessApiResponse<any>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      const result = await apiService.delete(`/api/blogs/${id}`);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to delete blog");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Blog deleted successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete blog");
    }
  };

  // ✅ RETURN ALL SERVICES
  return {
    token,
    getBlogs,
    getBlogById,
    getBlogByService,
    addBlog,
    updateBlog,
    deleteBlog,
  };
};