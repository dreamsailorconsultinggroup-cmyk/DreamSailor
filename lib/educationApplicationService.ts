// Education Application Service for handling form submissions

import { API_CONFIG, apiRequest } from './api-config';

// Types for the education application form
export interface EducationApplicationFormData {
  resume: File | null;
  fullname: string;
  contactNo: string;
  email: string;
  highestEducation: string;
  address: string;
  desiredCourse: string;
  preferredCountry: string;
  preferredEducationType: string;
}

// Response interfaces matching your backend
export interface ApiResponse<T> {
  success: boolean;
  successMessage?: string;
  errorMessage?: string;
  data?: T;
}

// Education Application Service Class
class EducationApplicationService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseURL;
  }

  /**
   * Submit a new education counseling application
   * @param formData Form data containing all required fields
   * @returns Promise with API response
   */
  async submitApplication(formData: EducationApplicationFormData): Promise<ApiResponse<string>> {
    try {
      // Create a FormData object for multipart/form-data submission (needed for file upload)
      const data = new FormData();
      
      // Map all form fields to the API's expected fields
      if (formData.resume) {
        data.append('Resume', formData.resume);
      }
      
      data.append('Fullname', formData.fullname);
      data.append('ContactNo', formData.contactNo);
      data.append('Email', formData.email);
      data.append('HighestEducation', formData.highestEducation);
      data.append('Address', formData.address);
      data.append('DesiredCourse', formData.desiredCourse);
      data.append('PreferredCountry', formData.preferredCountry);
      data.append('PreferredEducationType', formData.preferredEducationType);
      
      // Make the API request
      const url = `${this.baseUrl}${API_CONFIG.endpoints.education}`;
      
      // Using the fetch API directly for FormData
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        // No Content-Type header is needed as the browser sets it automatically with the boundary
      });
      
      // Parse the response
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Error submitting education application:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const educationApplicationService = new EducationApplicationService();

// Hook for using the education application service
export function useEducationApplicationService() {
  return educationApplicationService;
}