"use client";
import { useState, useEffect } from "react";
import { apiService } from "./apiService";

// Enums
export enum PropertyTypeEnum {
  Land = 1,
  House = 2,
  Apartment = 3,
  Commercial = 4,
}

// DTOs
export interface AddPropertyDto {
  name: string;
  description: string;
  propertyType?: PropertyTypeEnum;
  price?: number;
  location: string;
}

export interface ViewPropertyDto {
  name: string;
  description: string;
  propertyType?: PropertyTypeEnum;
  price?: number;
  location: string;
}

export interface FilterPropertyDto {
  pageNumber: number;
  pageSize: number;
  price?: number;
  location?: string;
  propertyType?: PropertyTypeEnum;
  searchName?: string;
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

interface SuccessApiResponse<T = any> {
  success: boolean;
  successMessage: string;
  data?: T;
}

interface ErrorApiResponse {
  success: false;
  errorMessage: string;
  errorDetails?: string[];
}

// === UTILITY: Get human-readable label (for UI) ===
export const getPropertyTypeLabel = (propertyType: PropertyTypeEnum): string => {
  switch (propertyType) {
    case PropertyTypeEnum.Land:
      return "Land";
    case PropertyTypeEnum.House:
      return "House";
    case PropertyTypeEnum.Apartment:
      return "Apartment";
    case PropertyTypeEnum.Commercial:
      return "Commercial";
    default:
      return "Unknown";
  }
};

// === UTILITY: Options for Select dropdown ===
export const getPropertyTypeOptions = () => {
  return [
    { value: PropertyTypeEnum.Land, label: "Land" },
    { value: PropertyTypeEnum.House, label: "House" },
    { value: PropertyTypeEnum.Apartment, label: "Apartment" },
    { value: PropertyTypeEnum.Commercial, label: "Commercial" },
  ];
};

// === MAIN HOOK ===
export const usePropertyService = () => {

  // === ADD PROPERTY ===
  const addProperty = async (
    propertyDto: AddPropertyDto
  ): Promise<SuccessApiResponse<ViewPropertyDto>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      const result = await apiService.post<ViewPropertyDto>(
        "/api/landsAndhomes",
        propertyDto
      );

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to add property");
      }

      return {
        success: true,
        successMessage: result.successMessage || "Property added successfully",
        data: result.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to add property");
    }
  };

  // === GET ALL PROPERTIES ===
  const getProperties = async (
    filterDto: FilterPropertyDto
  ): Promise<SuccessApiResponse<PaginatedList<ViewPropertyDto>>> => {
    try {
      const apiParams: Record<string, any> = {
        pageNumber: filterDto.pageNumber,
        pageSize: filterDto.pageSize,
      };

      if (filterDto.price !== undefined) {
        apiParams.Price = filterDto.price;
      }

      if (filterDto.location) {
        apiParams.Location = filterDto.location;
      }

      if (filterDto.propertyType !== undefined) {
        apiParams.PropertyType = filterDto.propertyType;
      }

      if (filterDto.searchName) {
        const trimmedSearch = filterDto.searchName.trim();
        if (trimmedSearch.length > 0) {
          apiParams.SearchName = trimmedSearch;
        }
      }

      console.log("Fetching properties with params:", apiParams);

      const result = await apiService.get<PaginatedList<ViewPropertyDto>>(
        "/api/landsAndhomes",
        apiParams
      );

      console.log("API response:", result);

      if (!result.success) {
        if (result.errorMessage === "No records found") {
          return {
            success: true,
            successMessage: "No properties found with the selected filters",
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
        throw new Error(result.errorMessage || "Failed to fetch properties");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Properties fetched successfully",
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in getProperties:", error);
      throw new Error(error.message || "Failed to fetch properties");
    }
  };

  // === GET SINGLE PROPERTY ===
  const getPropertyById = async (
    id: string
  ): Promise<SuccessApiResponse<ViewPropertyDto>> => {
    try {
      const result = await apiService.get<ViewPropertyDto>(
        `/api/landsAndhomes/${id}`
      );

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to fetch property");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Property fetched successfully",
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error in getPropertyById:", error);
      throw new Error(error.message || "Failed to fetch property");
    }
  };

  // === DELETE PROPERTY ===
  const deleteProperty = async (
    id: string
  ): Promise<SuccessApiResponse<void>> => {
    if (!apiService.isAuthenticated()) {
      throw new Error(
        "No authentication token available. Please log in first."
      );
    }

    try {
      const result = await apiService.delete(`/api/landsAndhomes/${id}`);

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to delete property");
      }

      return {
        success: true,
        successMessage:
          result.successMessage || "Property deleted successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete property");
    }
  };

  return {
    addProperty,
    getProperties,
    getPropertyById,
    deleteProperty,
  };
};