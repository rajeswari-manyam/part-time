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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Add Wedding Service Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update Wedding Service Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Get All Wedding Services Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Get Wedding Service By ID Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Get Nearby Wedding Services Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete Wedding Service Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, message: data.message || "Deleted successfully" };
  } catch (error) {
    console.error(`Error deleting wedding service with ID ${id}:`, error);
    return { success: false, message: "Failed to delete wedding service" };
  }
};

/** Fetch user's wedding services */
export const getUserWeddingServices = async (
  userId: string
): Promise<{ success: boolean; count?: number; data?: WeddingWorker[] }> => {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    console.log("🔍 Fetching user wedding services for userId:", userId);

    const url = `${API_BASE_URL}/getUserWedding?userId=${userId}`;
    console.log("📡 Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      },
      redirect: "follow",
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response:", errorText);
      console.error("❌ Response status:", response.status);

      // Return empty array instead of throwing to prevent UI crash
      if (response.status === 404) {
        console.warn("⚠️ Endpoint not found. Check if '/getUserWedding' exists on backend");
      }

      return {
        success: false,
        data: [],
      };
    }

    const data = await response.json();
    console.log("✅ API Response data:", data);

    // Handle multiple possible response structures
    if (Array.isArray(data)) {
      console.log("✅ Response is array, returning directly");
      return {
        success: true,
        data: data,
        count: data.length
      };
    } else if (data && Array.isArray(data.data)) {
      console.log("✅ Response has data property, returning data.data");
      return {
        success: true,
        data: data.data,
        count: data.count || data.data.length
      };
    } else if (data && Array.isArray(data.services)) {
      console.log("✅ Response has services property, returning data.services");
      return {
        success: true,
        data: data.services,
        count: data.services.length
      };
    } else if (data && typeof data === 'object') {
      console.warn("⚠️ Unexpected response structure:", data);
      // Try to extract any array from the object
      const arrayValue = Object.values(data).find(val => Array.isArray(val));
      if (arrayValue) {
        console.log("✅ Found array in response object");
        return {
          success: true,
          data: arrayValue as WeddingWorker[],
          count: (arrayValue as WeddingWorker[]).length
        };
      }
    }

    console.warn("⚠️ No valid data found in response, returning empty array");
    return {
      success: false,
      data: [],
    };
  } catch (error) {
    console.error("❌ getUserWeddingServices error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      userId
    });
    // Return empty array instead of throwing to prevent app crash
    return {
      success: false,
      data: [],
    };
  }
};
