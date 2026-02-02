// src/services/CorporateService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface CorporateWorker {
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

export interface CorporateWorkerResponse {
  success: boolean;
  count: number;
  data: CorporateWorker[];
}

/**
 * Fetch nearby corporate service providers
 * @param latitude number
 * @param longitude number
 * @param distance number in km (any distance)
 * @returns Promise<CorporateWorkerResponse>
 */
export const getNearbyCorporateWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<CorporateWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyCorporate?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CorporateWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching corporate workers:", error);
    return { success: false, count: 0, data: [] };
  }
};


/* ================= TYPES ================= */

export interface AddCorporateServicePayload {
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
  pincode: string;
  images?: File[]; // multiple images supported
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/* ================= ADD CORPORATE SERVICE ================= */

/**
 * Add a corporate service (multipart/form-data)
 */
export const addCorporateService = async (
  payload: AddCorporateServicePayload
): Promise<ApiResponse> => {
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
    formData.append("pincode", payload.pincode);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/addCorporateService`, {
      method: "POST",
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding corporate service:", error);
    return { success: false, message: "Failed to add corporate service" };
  }
};

/* ================= TYPES ================= */

export interface CorporateWorkerResponse {
  success: boolean;
  count: number;
  data: CorporateWorker[];
}

/* ================= GET ALL CORPORATE SERVICES ================= */

/**
 * Fetch all corporate services
 */
export const getAllCorporateServices = async (): Promise<CorporateWorkerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllCorporate`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all corporate services:", error);
    return {
      success: false,
      count: 0,
      data: [],
    };
  }
};

/**
 * Fetch a single corporate service by ID
 * @param corporateId string
 */
export const getCorporateById = async (
  corporateId: string
): Promise<{ success: boolean; data: any }> => {
  if (!corporateId) {
    throw new Error("Corporate ID is required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getCorporateById/${corporateId}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching corporate by ID:", error);
    return {
      success: false,
      data: null,
    };
  }
};
/* ================= UPDATE CORPORATE SERVICE ================= */

export interface UpdateCorporateServicePayload {
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
  pincode: string;
  images?: File[];
}

/**
 * Update a corporate service by ID
 * @param corporateId string
 * @param payload UpdateCorporateServicePayload
 */
export const updateCorporateService = async (
  corporateId: string,
  payload: UpdateCorporateServicePayload
): Promise<{ success: boolean; data?: any; message?: string }> => {
  if (!corporateId) {
    throw new Error("Corporate ID is required");
  }

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
    formData.append("pincode", payload.pincode);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/updateCorporate/${corporateId}`,
      {
        method: "PUT",
        body: formData,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating corporate service:", error);
    return {
      success: false,
      message: "Failed to update corporate service",
    };
  }
};
export const deleteCorporateService = async (
  corporateId: string
): Promise<{ success: boolean; message?: string }> => {
  if (!corporateId) {
    throw new Error("Corporate ID is required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/deleteCorporate/${corporateId}`,
      {
        method: "DELETE",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting corporate service:", error);
    return {
      success: false,
      message: "Failed to delete corporate service",
    };
  }
};


export interface GetUserCorporateParams {
  userId: string;
  serviceName?: string;
}

/**
 * Fetch corporate services created by a specific user
 * @param params { userId, serviceName? }
 */
export const getUserCorporateServices = async (
  params: GetUserCorporateParams
): Promise<{ success: boolean; count?: number; data?: any[] }> => {
  if (!params.userId) {
    throw new Error("userId is required");
  }

  const query = new URLSearchParams({
    userId: params.userId,
    ...(params.serviceName ? { serviceName: params.serviceName } : {}),
  }).toString();

  try {
    const response = await fetch(
      `${API_BASE_URL}/getUserCorporate/?${query}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user corporate services:", error);
    return {
      success: false,
      data: [],
    };
  }
};
