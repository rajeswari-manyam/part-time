// src/services/EducationService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface EducationService {
  _id?: string;
  userId?: string;
  name?: string;
  type?: string;
  email?: string;
  phone?: string;
  description?: string;
  subjects?: string[];
  qualifications?: string[];
  experience?: string;
  charges?: number;
  chargeType?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface EducationResponse {
  success: boolean;
  count: number;
  data: EducationService[];
}

/**
 * Fetch nearby educational/training centers
 */
export const getNearbyEducationCenters = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<EducationResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyEducation?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EducationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching education centers:", error);
    return { success: false, count: 0, data: [] };
  }
};

/**
 * Create a new education/training service
 */
export const createEducationService = async (education: EducationService) => {
  try {
    const formData = new URLSearchParams();
    for (const key in education) {
      const value = (education as any)[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else {
          formData.append(key, value.toString());
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/educationCreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating education service:", error);
    return { success: false, message: "Failed to create education service" };
  }
};
/**
 * Fetch all educational/training services
 */
export const getAllEducationServices = async (): Promise<EducationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllEducation`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EducationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all education services:", error);
    return { success: false, count: 0, data: [] };
  }
};
 
export const getEducationById = async (id: string): Promise<EducationService | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getEducationById/${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EducationService = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching education service with ID ${id}:`, error);
    return null;
  }
};


export const updateEducationService = async (
  id: string,
  education: EducationService
): Promise<any> => {
  try {
    const formData = new FormData();

    for (const key in education) {
      const value = (education as any)[key];
      if (value !== undefined && value !== null) {
        if (key === "images" && Array.isArray(value)) {
          // Append each file separately
          value.forEach((file: any, index: number) => {
            if (file instanceof File) {
              formData.append("images", file, file.name);
            } else if (typeof file === "string") {
              formData.append("images", file);
            }
          });
        } else if (Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else {
          formData.append(key, value.toString());
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/updateEducation/${id}`, {
      method: "PUT",
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error updating education service with ID ${id}:`, error);
    return { success: false, message: "Failed to update education service" };
  }
};
export const deleteEducationService = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteEducation/${id}`, {
      method: "DELETE",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error deleting education service with ID ${id}:`, error);
    return { success: false, message: "Failed to delete education service" };
  }
};

/**
 * Fetch education/training services for a specific user with optional filters
 */
export const getUserEducations = async (
  userId: string,
  type?: string,
  name?: string
): Promise<EducationResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);
    if (type) queryParams.append("type", type);
    if (name) queryParams.append("name", name);

    const response = await fetch(`${API_BASE_URL}/getUserEducations?${queryParams.toString()}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EducationResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching educations for user ${userId}:`, error);
    return { success: false, count: 0, data: [] };
  }
};