// src/services/LabourService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://13.204.29.0:3001";

export interface LabourWorker {
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  services?: string[];
  experience?: number;
  dailyWage?: number;
  chargeType?: string;
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

export interface LabourWorkerResponse {
  success: boolean;
  count: number;
  data: LabourWorker[];
}

export interface SingleLabourResponse {
  success: boolean;
  data: LabourWorker;
}

export interface AddLabourPayload {
  userId: string;
  description: string;
  category: string;
  subCategory: string;
  dailyWage: string;
  chargeType: string;
  latitude: string;
  longitude: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  name?: string;
  phone?: string;
  email?: string;
  images?: File[];
}

export interface UpdateLabourPayload {
  description?: string;
  category?: string;
  subCategory?: string;
  dailyWage?: string;
  chargeType?: string;
  latitude?: string;
  longitude?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  name?: string;
  phone?: string;
  email?: string;
  availability?: boolean;
}

/**
 * Add a new labour worker
 * @param payload AddLabourPayload
 * @returns Promise<any>
 */
export const addLabour = async (payload: AddLabourPayload): Promise<any> => {
  try {
    const formdata = new FormData();
    formdata.append("userId", payload.userId);
    formdata.append("description", payload.description);
    formdata.append("category", payload.category);
    formdata.append("subCategory", payload.subCategory);
    formdata.append("dailyWage", payload.dailyWage);
    formdata.append("chargeType", payload.chargeType);
    formdata.append("latitude", payload.latitude);
    formdata.append("longitude", payload.longitude);
    formdata.append("area", payload.area);
    formdata.append("city", payload.city);
    formdata.append("state", payload.state);
    formdata.append("pincode", payload.pincode);

    if (payload.name) formdata.append("name", payload.name);
    if (payload.phone) formdata.append("phone", payload.phone);
    if (payload.email) formdata.append("email", payload.email);
    
    // Append images if provided
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((image, index) => {
        formdata.append("images", image);
      });
    }

    const requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/addLabour`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding labour:", error);
    throw error;
  }
};

/**
 * Get all labour workers
 * @returns Promise<LabourWorkerResponse>
 */
export const getAllLabours = async (): Promise<LabourWorkerResponse> => {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/getAllLabours`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: LabourWorkerResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching all labours:", error);
    return { success: false, count: 0, data: [] };
  }
};

/**
 * Get labour worker by ID
 * @param labourId string
 * @returns Promise<SingleLabourResponse>
 */
export const getLabourById = async (labourId: string): Promise<SingleLabourResponse | null> => {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/getLabourById/${labourId}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SingleLabourResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching labour by ID:", error);
    return null;
  }
};

/**
 * Delete labour worker by ID
 * @param labourId string
 * @returns Promise<any>
 */
export const deleteLabour = async (labourId: string): Promise<any> => {
  try {
    const requestOptions: RequestInit = {
      method: "DELETE",
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/deleteLabour/${labourId}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting labour:", error);
    throw error;
  }
};

/**
 * Update labour worker by ID
 * @param labourId string
 * @param payload UpdateLabourPayload
 * @returns Promise<any>
 */
export const updateLabour = async (
  labourId: string,
  payload: UpdateLabourPayload
): Promise<any> => {
  try {
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/updateLabour/${labourId}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating labour:", error);
    throw error;
  }
};

/**
 * Get user's labour workers with optional subcategory filter
 * @param userId string
 * @param subCategory string (optional)
 * @returns Promise<LabourWorkerResponse>
 */
export const getUserLabours = async (
  userId: string,
  subCategory?: string
): Promise<LabourWorkerResponse> => {
  try {
    let url = `${API_BASE_URL}/getUserLabours?userId=${userId}`;
    
    if (subCategory) {
      url += `&subCategory=${encodeURIComponent(subCategory)}`;
    }

    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: LabourWorkerResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user labours:", error);
    return { success: false, count: 0, data: [] };
  }
};

/**
 * Fetch nearby labour service workers
 * @param latitude number
 * @param longitude number
 * @param distance number in km (any distance)
 * @returns Promise<LabourWorkerResponse>
 */
export const getNearbyLabourWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<LabourWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyLabours?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LabourWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching labour workers:", error);
    return { success: false, count: 0, data: [] };
  }
};

// Export all functions as a service object
const LabourService = {
  addLabour,
  getAllLabours,
  getLabourById,
  deleteLabour,
  updateLabour,
  getUserLabours,
  getNearbyLabourWorkers
};

export default LabourService;