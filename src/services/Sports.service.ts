// src/services/SportsActivityService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface SportsWorker {
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

export interface SportsWorkerResponse {
  success: boolean;
  count: number;
  data: SportsWorker[];
}

/**
 * Fetch nearby sports activity service providers
 * @param latitude number
 * @param longitude number
 * @param distance number in km (default 5)
 * @returns Promise<SportsWorkerResponse>
 */
export const getNearbySportsWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<SportsWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbySportsActivities?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SportsWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sports activity workers:", error);
    return { success: false, count: 0, data: [] };
  }
};
