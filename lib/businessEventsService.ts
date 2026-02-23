import { API_CONFIG, buildQueryParams } from "./api-config";


export interface BusinessEventsFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  inquiryType: string;
  organizationName?: string;
  eventDate?: string;
  budgetRange?: string;
  message: string;
}


export interface ApiResponse<T> {
  success: boolean;
  successMessage?: string;
  errorMessage?: string;
  data?: T;
}

export interface ViewBusinessEventsDto {
  id: string; // map from inquiryId
  fullName: string;
  email: string;
  phoneNumber: string;
  inquiryType: string;
  organizationName?: string;
  eventDate?: string;
  budgetRange?: string;
  message?: string;
}


export interface FilterBusinessEventsDto {
  pageNumber?: number;
  pageSize?: number;
  searchName?: string;
  inquiryType?: string;
  latest?: boolean;
}


export interface PaginatedList<T> {
  currentPageNum: number;
  totalPages: number;
  totalCount: number;
  pageTotal: number;
  items: T[];
}

export interface FileDownloadResponse {
  fileName: string;
  bytes: string;
}


class BusinessEventsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseURL;
  }


  async submitApplication(formData: BusinessEventsFormData) {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.events}/add`;

    const payload = {
      FullName: formData.fullName,
      Email: formData.email,
      PhoneNumber: formData.phoneNumber,
      InquiryType: formData.inquiryType,
      OrganizationName: formData.organizationName || "",
      EventDate: formData.eventDate
        ? new Date(formData.eventDate + "T00:00:00").toISOString()
        : null,
      BudgetRange: formData.budgetRange || "",
      Message: formData.message,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error: any) {
      console.error("Error submitting event/business application:", error);
      return {
        success: false,
        errorMessage: error.message || "Unknown error",
      };
    }
  }


  async getAll(): Promise<PaginatedList<ViewBusinessEventsDto>> {
  const url = `${this.baseUrl}${API_CONFIG.endpoints.events}/get-all`;
  try {
    const response = await fetch(url);
    const dataArray = await response.json() as any[];

    const items: ViewBusinessEventsDto[] = dataArray.map(item => ({
      id: item.inquiryId,
      fullName: item.fullName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      inquiryType: item.inquiryType,
      organizationName: item.organizationName,
      eventDate: item.eventDate,
      budgetRange: item.budgetRange,
      message: item.message,
  
    }));

    return {
      currentPageNum: 1,
      totalPages: 1,
      totalCount: items.length,
      pageTotal: 1,
      items,
    };
  } catch (err) {
    console.error("Error fetching events:", err);
    return { currentPageNum: 1, totalPages: 0, totalCount: 0, pageTotal: 0, items: [] };
  }
}



 async getById(id: string): Promise<ViewBusinessEventsDto> {
  const url = `${this.baseUrl}${API_CONFIG.endpoints.events}/${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      id: data.inquiryId,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      inquiryType: data.inquiryType,
      organizationName: data.organizationName,
      eventDate: data.eventDate,
      budgetRange: data.budgetRange,
      message: data.message,
     
    };
  } catch (err) {
    console.error("Error fetching event detail:", err);
    throw err;
  }
}



  async delete(id: string): Promise<void> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.events}/${id}`;

    try {
      const response = await fetch(url, { method: "DELETE" });
      const result: ApiResponse<string> = await response.json();

      if (!result.success) {
        throw new Error(result.errorMessage || "Failed to delete entry");
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      throw err;
    }
  }
}

export const businessEventsService = new BusinessEventsService();

// Hook for React / Next.js
export function useBusinessEventsService() {
  return businessEventsService;
}
