// src/services/BusinessService.service.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ---- Interfaces ----
export interface BusinessWorker {
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

export interface BusinessWorkerResponse {
  success: boolean;
  count: number;
  data: BusinessWorker[];
}

export interface CreateServicePayload {
  userId: string;
  serviceType: string;
  title: string;
  description: string;
  skills: string;
  serviceCharge: string;
  chargeType: string;
  experience: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

export interface CreateServiceResponse {
  success: boolean;
  message: string;
  data?: BusinessWorker;
}

// ---- Fetch nearby business workers ----
export const getNearbyBusinessWorkers = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<BusinessWorkerResponse> => {
  if (!distance || distance <= 0) {
    throw new Error("Please provide a valid distance in km");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/getnearbybusinessworkers?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      { method: "GET", redirect: "follow" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BusinessWorkerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching business workers:", error);
    return { success: false, count: 0, data: [] };
  }
};

// ---- Create new business service ----
export const createBusinessService = async (
  payload: CreateServicePayload
): Promise<CreateServiceResponse> => {
  try {
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${API_BASE_URL}/createService`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CreateServiceResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating business service:", error);
    return { success: false, message: "Failed to create service" };
  }
};
// ---- Fetch all business services ----
export interface AllServicesResponse {
  success: boolean;
  count: number;
  data: BusinessWorker[];
}

export const getAllBusinessServices = async (): Promise<AllServicesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAllServices`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AllServicesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all business services:", error);
    return { success: false, count: 0, data: [] };
  }
};
// ---- Fetch business service by ID ----
export interface ServiceByIdResponse {
  success: boolean;
  data?: BusinessWorker;
  message?: string;
}

export const getBusinessServiceById = async (
  serviceId: string
): Promise<ServiceByIdResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getServiceById/${serviceId}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ServiceByIdResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching service by ID (${serviceId}):`, error);
    return { success: false, message: "Failed to fetch service" };
  }
};
// ---- Update business service ----
export interface UpdateServicePayload {
  userId: string;
  serviceType: string;
  title: string;
  description: string;
  skills: string;
  serviceCharge: string;
  chargeType: string;
  experience: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

export interface UpdateServiceResponse {
  success: boolean;
  message: string;
  data?: BusinessWorker;
}

export const updateBusinessService = async (
  serviceId: string,
  payload: UpdateServicePayload
): Promise<UpdateServiceResponse> => {
  try {
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${API_BASE_URL}/updateService/${serviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UpdateServiceResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating service (${serviceId}):`, error);
    return { success: false, message: "Failed to update service" };
  }
};
// ---- Delete business service ----
export interface DeleteServiceResponse {
  success: boolean;
  message: string;
}

export const deleteBusinessService = async (
  serviceId: string
): Promise<DeleteServiceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteService/${serviceId}`, {
      method: "DELETE",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DeleteServiceResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting service (${serviceId}):`, error);
    return { success: false, message: "Failed to delete service" };
  }
};
