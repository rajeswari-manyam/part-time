// src/services/WeddingService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface WeddingWorker {
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

export interface WeddingWorkerResponse {
  success: boolean;
  count: number;
  data: WeddingWorker[];
}

/**
 * Fetch nearby wedding service providers
 * @param latitude number
 * @param longitude number
 * @param distance number in km (any distance)
 * @returns Promise<WeddingWorkerResponse>
 */
export const getNearbyWeddingWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<WeddingWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyWeddingServices?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WeddingWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wedding workers:", error);
    return { success: false, count: 0, data: [] };
  }
};
