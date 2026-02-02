// src/services/BeautyService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface BeautyWorker {
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

export interface BeautyWorkerResponse {
  success: boolean;
  count: number;
  data: BeautyWorker[];
}

/**
 * Fetch nearby beauty & wellness workers
 */
export const getNearbyBeautyWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<BeautyWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/getnearbybeautyworkers?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BeautyWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching beauty workers:", error);
    return { success: false, count: 0, data: [] };
  }
};
export const createBeautyWorker = async (worker: Partial<BeautyWorker>): Promise<any> => {
  try {
    const formData = new URLSearchParams();
    
    // Append all provided fields dynamically
    Object.entries(worker).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v.toString()));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/beautycreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData,
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: unknown) {
    // Type narrowing for unknown error
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error creating beauty worker:", message);
    return { success: false, message };
  }
};
/**
 * Fetch all beauty & wellness workers
 */
export const getAllBeautyWorkers = async (): Promise<BeautyWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllBeautyWellnessWorkers`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BeautyWorkerResponse = await response.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error fetching all beauty workers:", message);
    return { success: false, count: 0, data: [] };
  }
};
/**
 * Fetch a single beauty worker by ID
 * @param id string - Worker ID
 * @returns Promise<BeautyWorker | null>
 */
export const getBeautyWorkerById = async (id: string): Promise<BeautyWorker | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getbeautyworkerById/${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BeautyWorker = await response.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error fetching beauty worker with ID ${id}:`, message);
    return null;
  }
};
/**
 * Update a beauty worker by ID
 * @param id string - Worker ID
 * @param worker Partial<BeautyWorker> - Fields to update
 * @param imageFile optional File - Image to upload
 * @returns Promise<any>
 */
export const updateBeautyWorker = async (
  id: string,
  worker: Partial<BeautyWorker>,
  imageFile?: File
): Promise<any> => {
  try {
    const formData = new FormData();

    // Append all worker fields dynamically
    Object.entries(worker).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v.toString()));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append("images", imageFile, imageFile.name);
    }

    const response = await fetch(`${API_BASE_URL}/updatebeautyworker/${id}`, {
      method: "PUT",
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error updating beauty worker with ID ${id}:`, message);
    return { success: false, message };
  }
};
/**
 * Delete a beauty worker by ID
 * @param id string - Worker ID
 * @returns Promise<any>
 */
export const deleteBeautyWorkerById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/deletebeautyworkerById/${id}`, {
      method: "DELETE",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error deleting beauty worker with ID ${id}:`, message);
    return { success: false, message };
  }
};
/**
 * Fetch beauty workers for a specific user filtered by category and services
 * @param userId string - User ID
 * @param category string - Category (optional)
 * @param services string - Service name (optional)
 * @returns Promise<BeautyWorkerResponse>
 */
export const getUserBeautyWorkers = async (
  userId: string,
  category?: string,
  services?: string
): Promise<BeautyWorkerResponse> => {
  try {
    const params = new URLSearchParams({ userId });
    if (category) params.append("category", category);
    if (services) params.append("services", services);

    const response = await fetch(`${API_BASE_URL}/getUserBeautyWorkers?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BeautyWorkerResponse = await response.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error fetching beauty workers for user ${userId}:`, message);
    return { success: false, count: 0, data: [] };
  }
};
