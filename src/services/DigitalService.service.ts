// src/services/DigitalService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

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
  chargeType?: string;
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

/**
 * Add a new digital service
 * @param formData FormData containing service details and images
 * @returns Promise<any>
 */
export const addDigitalService = async (formData: FormData): Promise<any> => {
  try {
    console.log('📤 Sending FormData to API:');
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    const response = await fetch(`${API_BASE_URL}/addDigitalService`, {
      method: "POST",
      body: formData,
      redirect: "follow",
    });

    const responseText = await response.text();
    console.log('📥 Server response:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: `;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage += errorData.message || errorData.error || 'Server error';
        return { success: false, message: errorMessage, details: errorData };
      } catch {
        errorMessage += responseText || response.statusText;
        return { success: false, message: errorMessage };
      }
    }

    try {
      const result = JSON.parse(responseText);
      return result;
    } catch {
      return { success: false, message: "Invalid server response" };
    }

  } catch (error: any) {
    console.error("❌ Network or fetch error:", error);
    return {
      success: false,
      message: error.message || "Network error - failed to connect to server"
    };
  }
};

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
    console.error("Error fetching digital service workers:", error);
    return { success: false, count: 0, data: [] };
  }
};

/**
 * Fetch all digital services
 * @returns Promise<DigitalWorkerResponse>
 */
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
 * Fetch a digital service by ID
 * @param id string - the digital service _id
 * @returns Promise<DigitalWorker | null>
 */
export const getDigitalServiceById = async (id: string): Promise<DigitalWorker | null> => {
  if (!id) throw new Error("Digital service ID is required");

  try {
    const response = await fetch(`${API_BASE_URL}/getDigitalServiceById/${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: DigitalWorker } = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching digital service by ID (${id}):`, error);
    return null;
  }
};

/**
 * Update an existing digital service by ID
 * @param id string - the digital service _id
 * @param formData FormData containing updated service details and images
 * @returns Promise<any>
 */
export const updateDigitalService = async (id: string, formData: FormData): Promise<any> => {
  if (!id) throw new Error("Digital service ID is required");

  try {
    console.log('📤 Updating digital service with FormData:');
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    const response = await fetch(`${API_BASE_URL}/updateDigitalService/${id}`, {
      method: "PUT",
      body: formData,
      redirect: "follow",
    });

    const responseText = await response.text();
    console.log('📥 Server response:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: `;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage += errorData.message || errorData.error || 'Server error';
        return { success: false, message: errorMessage, details: errorData };
      } catch {
        errorMessage += responseText || response.statusText;
        return { success: false, message: errorMessage };
      }
    }

    try {
      const result = JSON.parse(responseText);
      return result;
    } catch {
      return { success: false, message: "Invalid server response" };
    }

  } catch (error: any) {
    console.error(`❌ Error updating digital service (${id}):`, error);
    return {
      success: false,
      message: error.message || "Network error"
    };
  }
};

/**
 * Delete a digital service by ID
 * @param id string - the digital service _id
 * @returns Promise<any>
 */
export const deleteDigitalService = async (id: string): Promise<any> => {
  if (!id) throw new Error("Digital service ID is required");

  try {
    const response = await fetch(`${API_BASE_URL}/deleteDigitalService/${id}`, {
      method: "DELETE",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error deleting digital service (${id}):`, error);
    return { success: false, message: "Failed to delete digital service" };
  }
};

/**
 * Fetch digital services for a specific user, optionally filtered by service name
 * @param userId string - ID of the user
 * @param serviceName string (optional) - filter by service name
 * @returns Promise<DigitalWorkerResponse>
 */
export const getUserDigitalServices = async (
  userId: string,
  serviceName?: string
): Promise<DigitalWorkerResponse> => {
  if (!userId) throw new Error("User ID is required");

  try {
    let url = `${API_BASE_URL}/getUserDigitalServices?userId=${userId}`;
    if (serviceName) {
      url += `&serviceName=${encodeURIComponent(serviceName)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DigitalWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching digital services for user (${userId}):`, error);
    return { success: false, count: 0, data: [] };
  }
};