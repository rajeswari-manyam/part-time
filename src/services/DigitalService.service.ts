// src/services/DigitalService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface DigitalWorker {
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  services?: string[];
  experience?: number;
  serviceCharge?: number;
  bio?: string;
  images?: string[];
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  availability?: boolean;
  rating?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface DigitalWorkerResponse {
  success: boolean;
  count: number;
  data: DigitalWorker[];
}

export interface AddDigitalServicePayload {
  userId: string;
  serviceName: string;
  description: string;
  category: string;
  subCategory: string;
  serviceCharge: string | number;
  chargeType: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

/**
 * Fetch nearby digital service workers
 * @param latitude number
 * @param longitude number
 * @param distance number in km (default 5)
 * @returns Promise<DigitalWorkerResponse>
 */
export const getNearbyDigitalWorkers = async (
  latitude: number,
  longitude: number,
  distance: number = 5
): Promise<DigitalWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyDigitalServices?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DigitalWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching digital workers:", error);
    return { success: false, count: 0, data: [] };
  }
};

/**
 * Add a new digital service
 * @param payload AddDigitalServicePayload
 * @returns Promise<any>
 */
export const addDigitalService = async (payload: AddDigitalServicePayload): Promise<any> => {
  try {
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value)));

    const response = await fetch(`${API_BASE_URL}/addDigitalService`, {
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
    console.error("Error adding digital service:", error);
    return { success: false, message: "Failed to add service" };
  }
};

export const getAllDigitalServices = async (): Promise<DigitalWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllDigitalServices`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DigitalWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all digital services:", error);
    return { success: false, count: 0, data: [] };
  }
};

/**
 * Fetch digital service by ID
 * @param id string
 * @returns Promise<DigitalWorker | null>
 */
export const getDigitalServiceById = async (id: string): Promise<DigitalWorker | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getDigitalServicesById/${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DigitalWorker = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching digital service by ID ${id}:`, error);
    return null;
  }
};

export interface AddOrUpdateDigitalServicePayload {
  userId: string;
  serviceName: string;
  description: string;
  category: string;
  subCategory: string;
  serviceCharge: string | number;
  chargeType: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

/**
 * Update an existing digital service by ID
 * @param id string - the digital service ID
 * @param payload AddOrUpdateDigitalServicePayload
 * @returns Promise<any>
 */
export const updateDigitalService = async (
  id: string,
  payload: AddOrUpdateDigitalServicePayload
): Promise<any> => {
  try {
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value)));

    const response = await fetch(`${API_BASE_URL}/updateDigitalService/${id}`, {
      method: "PUT",
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
    console.error(`Error updating digital service with ID ${id}:`, error);
    return { success: false, message: "Failed to update service" };
  }
};


export const deleteDigitalService = async (
  id: string,
  category: string,
  serviceName: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/getUserBusiness?category=${encodeURIComponent(
        category
      )}&serviceName=${encodeURIComponent(serviceName)}&_id=${id}`,
      {
        method: "DELETE",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(`Error deleting digital service with ID ${id}:`, error);
    return { success: false, message: "Failed to delete service" };
  }
};

export const getUserDigitalServices = async (userId: string): Promise<DigitalWorkerResponse> => {
  try {
    // Note: Assuming 'Tech & Digital Services' or similar category string is required. 
    // If the endpoint returns all businesses for the user, we might need to filter client-side.
    // However, the delete instructions imply querying by category is supported/required.
    // Here we request all user businesses, filtering might happen on the backend or we filter here.
    // For now, let's assume we fetch all and filter in the component or rely on backend.
    // Or closer to other services:
    const response = await fetch(`${API_BASE_URL}/getUserBusiness?userId=${userId}&category=Tech & Digital Services`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      // If 404 or similar, maybe just return empty
      if (response.status === 404) return { success: true, count: 0, data: [] };
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DigitalWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching digital services for user ${userId}:`, error);
    return { success: false, count: 0, data: [] };
  }
};

