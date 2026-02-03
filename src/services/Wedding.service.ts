// src/services/WeddingService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* =========================
   INTERFACES
========================= */

export interface WeddingWorker {
  _id?: string;
  userId?: string;
  serviceName?: string;
  description?: string;
  subCategory?: string;
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

export interface WeddingWorkerResponse {
  success: boolean;
  count: number;
  data: WeddingWorker[];
}

export interface SingleWeddingWorkerResponse {
  success: boolean;
  data: WeddingWorker;
}

/* =========================
   API METHODS
========================= */

/** Add a new wedding service */
export const addWeddingService = async (workerData: FormData): Promise<SingleWeddingWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/addWeddingService`, {
      method: "POST",
      body: workerData,
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: SingleWeddingWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding wedding service:", error);
    return { success: false, data: {} as WeddingWorker };
  }
};

/** Update a wedding service by ID */
export const updateWeddingService = async (id: string, workerData: FormData): Promise<SingleWeddingWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateWeddingService/${id}`, {
      method: "PUT",
      body: workerData,
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: SingleWeddingWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating wedding service with ID ${id}:`, error);
    return { success: false, data: {} as WeddingWorker };
  }
};

/** Fetch all wedding services */
export const getAllWeddingServices = async (): Promise<WeddingWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllWeddingServices`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: WeddingWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all wedding services:", error);
    return { success: false, count: 0, data: [] };
  }
};

/** Fetch a wedding service by ID */
export const getWeddingServiceById = async (id: string): Promise<SingleWeddingWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getWeddingServiceById/${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: SingleWeddingWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching wedding service with ID ${id}:`, error);
    return { success: false, data: {} as WeddingWorker };
  }
};

/** Fetch nearby wedding services */
export const getNearbyWeddingWorkers = async (
  latitude: number,
  longitude: number,
  distance: number = 5
): Promise<WeddingWorkerResponse> => {
  if (!distance || distance <= 0) throw new Error("Please provide a valid distance in km");

  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyWeddingServices?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: WeddingWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching nearby wedding services:", error);
    return { success: false, count: 0, data: [] };
  }
};

/** Delete a wedding service by ID */
export const deleteWeddingService = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteWeddingService/${id}`, {
      method: "DELETE",
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { success: true, message: data.message || "Deleted successfully" };
  } catch (error) {
    console.error(`Error deleting wedding service with ID ${id}:`, error);
    return { success: false, message: "Failed to delete wedding service" };
  }
};

/** Fetch all wedding services from external IP (example: 13.204.29.0) */
export const fetchAllWeddingServicesExternal = async (): Promise<WeddingWorkerResponse> => {
  try {
    const response = await fetch("http://13.204.29.0:3001/getAllWeddingServices", {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching wedding services from external API:", error);
    return { success: false, count: 0, data: [] };
  }
};
