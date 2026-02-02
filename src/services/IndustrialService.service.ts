const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* ===================== INTERFACES ===================== */

export interface IndustrialWorker {
  _id?: string;
  userId?: string;
  serviceName?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  serviceCharge?: number;
  chargeType?: string;
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

export interface IndustrialWorkerResponse {
  success: boolean;
  count?: number;
  data?: IndustrialWorker[] | IndustrialWorker;
  message?: string;
}

/* ===================== ADD INDUSTRIAL SERVICE ===================== */

/**
 * Add a new industrial service
 */
export const addIndustrialService = async (
  payload: {
    userId: string;
    serviceName: string;
    description: string;
    category: string;
    subCategory: string;
    serviceCharge: string | number;
    chargeType: string;
    latitude: number;
    longitude: number;
    area: string;
    city: string;
    state: string;
    pincode: string;
    images?: File[];
  }
): Promise<IndustrialWorkerResponse> => {
  try {
    const formData = new FormData();

    formData.append("userId", payload.userId);
    formData.append("serviceName", payload.serviceName);
    formData.append("description", payload.description);
    formData.append("category", payload.category);
    formData.append("subCategory", payload.subCategory);
    formData.append("serviceCharge", String(payload.serviceCharge));
    formData.append("chargeType", payload.chargeType);
    formData.append("latitude", String(payload.latitude));
    formData.append("longitude", String(payload.longitude));
    formData.append("area", payload.area);
    formData.append("city", payload.city);
    formData.append("state", payload.state);
    formData.append("pincode", payload.pincode);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/addIndustrialService`, {
      method: "POST",
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding industrial service:", error);
    return {
      success: false,
      message: "Failed to add industrial service",
    };
  }
};

/* ===================== GET NEARBY INDUSTRIAL WORKERS ===================== */

/**
 * Fetch nearby industrial service workers
 */
export const getNearbyIndustrialWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<IndustrialWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getNearbyIndustrialServices?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching industrial service workers:", error);
    return { success: false, count: 0, data: [] };
  }
};
/**
 * Fetch all industrial services
 */
export const getAllIndustrialServices = async (): Promise<IndustrialWorkerResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/getAllIndustrialServices`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IndustrialWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all industrial services:", error);
    return {
      success: false,
      count: 0,
      data: [],
    };
  }
};
/**
 * Fetch industrial service by ID
 * @param serviceId string
 */
export const getIndustrialServiceById = async (
  serviceId: string
): Promise<IndustrialWorkerResponse> => {
  if (!serviceId) {
    throw new Error("Service ID is required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/getIndustrialServiceById/${serviceId}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IndustrialWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching industrial service by ID:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch industrial service by ID",
    };
  }
};
/**
 * Update industrial service by ID
 * @param serviceId string
 * @param payload update fields
 */
export const updateIndustrialService = async (
  serviceId: string,
  payload: {
    serviceName?: string;
    description?: string;
    category?: string;
    subCategory?: string;
    serviceCharge?: string | number;
    chargeType?: string;
    latitude?: number;
    longitude?: number;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    images?: File[];
  }
): Promise<IndustrialWorkerResponse> => {
  if (!serviceId) {
    throw new Error("Service ID is required");
  }

  try {
    const formData = new FormData();

    if (payload.serviceName)
      formData.append("serviceName", payload.serviceName);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.category)
      formData.append("category", payload.category);
    if (payload.subCategory)
      formData.append("subCategory", payload.subCategory);
    if (payload.serviceCharge !== undefined)
      formData.append("serviceCharge", String(payload.serviceCharge));
    if (payload.chargeType)
      formData.append("chargeType", payload.chargeType);
    if (payload.latitude !== undefined)
      formData.append("latitude", String(payload.latitude));
    if (payload.longitude !== undefined)
      formData.append("longitude", String(payload.longitude));
    if (payload.area)
      formData.append("area", payload.area);
    if (payload.city)
      formData.append("city", payload.city);
    if (payload.state)
      formData.append("state", payload.state);
    if (payload.pincode)
      formData.append("pincode", payload.pincode);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/updateIndustrialService/${serviceId}`,
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
    console.error("Error updating industrial service:", error);
    return {
      success: false,
      message: "Failed to update industrial service",
    };
  }
};
/**
 * Delete industrial service by ID
 * @param serviceId string
 */
export const deleteIndustrialService = async (
  serviceId: string
): Promise<IndustrialWorkerResponse> => {
  if (!serviceId) {
    throw new Error("Service ID is required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/deleteIndustrialService/${serviceId}`,
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
    console.error("Error deleting industrial service:", error);
    return {
      success: false,
      message: "Failed to delete industrial service",
    };
  }
};
