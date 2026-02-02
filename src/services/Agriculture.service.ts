// src/services/AgricultureService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface AgricultureWorker {
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

export interface AgricultureWorkerResponse {
  success: boolean;
  count: number;
  data: AgricultureWorker[];
}

/**
 * Fetch nearby agriculture service workers
 * @param latitude number
 * @param longitude number
 * @param distance number in km (any distance)
 * @returns Promise<AgricultureWorkerResponse>
 */
export const getNearbyAgricultureWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<AgricultureWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyAgriculture?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AgricultureWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agriculture workers:", error);
    return { success: false, count: 0, data: [] };
  }
};

export interface AddAgriculturePayload {
  userId: string;
  serviceName: string;
  description: string;
  subCategory: string;
  serviceCharge: number;
  chargeType: string;
  latitude: number;
  longitude: number;
  area: string;
  city: string;
  state: string;
  images: File[]; // important
}

/* ================= API ================= */

export const addAgricultureService = async (
  payload: AddAgriculturePayload
): Promise<any> => {
  try {
    const formData = new FormData();

    formData.append("userId", payload.userId);
    formData.append("serviceName", payload.serviceName);
    formData.append("description", payload.description);
    formData.append("subCategory", payload.subCategory);
    formData.append("serviceCharge", payload.serviceCharge.toString());
    formData.append("chargeType", payload.chargeType);
    formData.append("latitude", payload.latitude.toString());
    formData.append("longitude", payload.longitude.toString());
    formData.append("area", payload.area);
    formData.append("city", payload.city);
    formData.append("state", payload.state);

    payload.images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await fetch(`${API_BASE_URL}/addAgriculture`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add agriculture service");
    }

    return await response.json();
  } catch (error) {
    console.error("addAgricultureService error:", error);
    throw error;
  }
};
export interface AgricultureService {
  _id: string;
  userId: string;
  serviceName: string;
  description: string;
  subCategory: string;
  serviceCharge: number;
  chargeType: string;
  latitude: number;
  longitude: number;
  area: string;
  city: string;
  state: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const getAgricultureById = async (
  agricultureId: string
): Promise<AgricultureService> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/getAgricultureById/${agricultureId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch agriculture service");
    }

    return await response.json();
  } catch (error) {
    console.error("getAgricultureById error:", error);
    throw error;
  }
};
export const deleteAgricultureById = async (
  agricultureId: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/deleteAgriculture/${agricultureId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete agriculture service");
    }

    return await response.json();
  } catch (error) {
    console.error("deleteAgricultureById error:", error);
    throw error;
  }
};
export const getAllAgricultureServices = async (): Promise<AgricultureService[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllAgriculture`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch agriculture services");
    }

    return await response.json();
  } catch (error) {
    console.error("getAllAgricultureServices error:", error);
    throw error;
  }
};
export interface UpdateAgriculturePayload {
  serviceName?: string;
  description?: string;
  subCategory?: string;
  serviceCharge?: number;
  chargeType?: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  city?: string;
  state?: string;
  images?: File[]; // optional (only if updating images)
}
export const updateAgricultureById = async (
  agricultureId: string,
  payload: UpdateAgriculturePayload
): Promise<AgricultureService> => {
  try {
    const formData = new FormData();

    if (payload.serviceName)
      formData.append("serviceName", payload.serviceName);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.subCategory)
      formData.append("subCategory", payload.subCategory);
    if (payload.serviceCharge !== undefined)
      formData.append("serviceCharge", payload.serviceCharge.toString());
    if (payload.chargeType)
      formData.append("chargeType", payload.chargeType);
    if (payload.latitude !== undefined)
      formData.append("latitude", payload.latitude.toString());
    if (payload.longitude !== undefined)
      formData.append("longitude", payload.longitude.toString());
    if (payload.area) formData.append("area", payload.area);
    if (payload.city) formData.append("city", payload.city);
    if (payload.state) formData.append("state", payload.state);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((img) => {
        formData.append("images", img);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/updateAgricultureById/${agricultureId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update agriculture service");
    }

    return await response.json();
  } catch (error) {
    console.error("updateAgricultureById error:", error);
    throw error;
  }
};
export const getUserAgricultureServices = async (
  userId: string,
  serviceName?: string
): Promise<AgricultureService[]> => {
  try {
    const params = new URLSearchParams({ userId });

    if (serviceName) {
      params.append("serviceName", serviceName);
    }

    const response = await fetch(
      `${API_BASE_URL}/getUserAgriculture?${params.toString()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user agriculture services");
    }

    return await response.json();
  } catch (error) {
    console.error("getUserAgricultureServices error:", error);
    throw error;
  }
};
