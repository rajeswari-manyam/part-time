import axios from "axios";

export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://192.168.1.40:3000";

// Axios instance for x-www-form-urlencoded requests
const API_FORM = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

// Axios instance for multipart/form-data (file uploads)
const API_MULTIPART = axios.create({
    baseURL: API_BASE_URL,
    // Do NOT set Content-Type manually, axios will handle it
});

// ------------------- OTP APIs -------------------
export const sendOtp = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const body = new URLSearchParams({ phone: cleanPhone }).toString();
    const response = await API_FORM.post("/send-otp", body);
    return response.data;
};

export const verifyOtp = async (phone: string, otp: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const body = new URLSearchParams({ phone: cleanPhone, otp }).toString();
    const response = await API_FORM.post("/verify-otp", body);
    return response.data;
};

export const resendOtp = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const body = new URLSearchParams({ phone: cleanPhone }).toString();
    const response = await API_FORM.post("/resend-otp", body);
    return response.data;
};


export interface CreateJobPayload {
    userId: string;
    title: string;
    description: string;
    category: string;
    latitude: number | string;
    longitude: number | string;
    images?: File[];
}

export const createJob = async (data: CreateJobPayload) => {
    const formData = new FormData();

    formData.append("userId", data.userId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("latitude", String(data.latitude));
    formData.append("longitude", String(data.longitude));

    if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
            formData.append("images", file);
        });
    }

    const response = await API_MULTIPART.post("/jobcreate", formData);
    return response.data;
};

export const getJobById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getJobById/${id}`);
        return response.data; // assuming your API responds with { success: true, data: {...} }
    } catch (error: any) {
        throw error;
    }
};

/* ✅ GET ALL JOBS */
export const getAllJobs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllJobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        throw error;
    }
};
export const deleteJob = async (jobId: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteJob/${jobId}`)
        return response.data
    }
    catch (error) {
        console.error("Error deleting job:", error)
        throw error
    }
};
export interface UpdateJobPayload {
    title?: string;
    description?: string;
    category?: string;
    latitude?: number | string;
    longitude?: number | string;
    images?: File[]; // optional
}
// In your api.service.ts file
export const updateJob = async (jobId: string, payload: any) => {
    const formData = new FormData();

    // Append all text fields
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subcategory) formData.append("subcategory", payload.subcategory);
    if (payload.price) formData.append("price", payload.price);
    if (payload.location) formData.append("location", payload.location);
    if (payload.latitude) formData.append("latitude", payload.latitude.toString());
    if (payload.longitude) formData.append("longitude", payload.longitude.toString());

    // Append new image files
    if (payload.images && payload.images.length > 0) {
        payload.images.forEach((image: File) => {
            formData.append("images", image);
        });
    }

    const response = await fetch(`${API_BASE_URL}/updateJob/${jobId}`, {
        method: "PUT",
        body: formData,
        // DO NOT set Content-Type header - browser will set it automatically with boundary
    });

    return response.json();
};
export const getNearbyJobsForWorker = async (workerId: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/getNearbyJobsForWorker/${workerId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching nearby jobs for worker:", error);
        throw error;
    }
};
export interface GetNearbyWorkersParams {
    latitude: number;
    longitude: number;
    range?: number;
}

export const getNearbyWorkers = async ({
    latitude,
    longitude,
    range = 10,
}: GetNearbyWorkersParams) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/getNearbyWorkers`,
            {
                params: {
                    latitude,
                    longitude,
                    range,
                },
            }
        );

        return response.data; // { success, count, data }
    } catch (error) {
        console.error("Error fetching nearby workers:", error);
        throw error;
    }
};
export const getAllWorkers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllWorkers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all workers:", error);
        throw error;
    }
};
export const getUserJobs = async (userId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getUserJobs`, {
            params: { userId },
        });
        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error("Error fetching user jobs:", error);
        throw error;
    }
};
// ------------------- WORKER APIs -------------------

export interface Worker {
    _id: string;
    name: string;
    email: string;
    category: string;
    chargeType: string;
    serviceCharge: number;
    latitude: number;
    longitude: number;
    isActive: boolean;
    images: string;
    profilePic: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const getWorkerById = async (workerId: string): Promise<{ success: boolean; data: Worker }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getWorkerById/${workerId}`);
        return response.data; // { success: true, data: {...} }
    } catch (error) {
        console.error("Error fetching worker by ID:", error);
        throw error;
    }
};
export interface UpdateUserPayload {
    name?: string;
    email?: string;
    phone?: string;
    category?: string;
    subCategory?: string;
    latitude?: number | string;
    longitude?: number | string;
    role?: string;
}

// Update user by ID
export const updateUserById = async (userId: string, payload: UpdateUserPayload) => {
    try {
        // Convert payload to x-www-form-urlencoded format
        const body = new URLSearchParams();

        if (payload.name) body.append("name", payload.name);
        if (payload.email) body.append("email", payload.email);
        if (payload.phone) body.append("phone", payload.phone);
        if (payload.category) body.append("category", payload.category);
        if (payload.subCategory) body.append("subCategory", payload.subCategory);
        if (payload.latitude) body.append("latitude", payload.latitude.toString());
        if (payload.longitude) body.append("longitude", payload.longitude.toString());
        if (payload.role) body.append("role", payload.role);

        const response = await API_FORM.put(`/updateUserById/${userId}`, body.toString());
        return response.data; // { success, message, data }
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
// ------------------- USER APIs -------------------

export interface User {
  id: string;
  phone: string;
  name: string;
  latitude?: string;
  longitude?: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getUserById = async (userId: string): Promise<{ success: boolean; data: User }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUserById/${userId}`);
    return response.data; // { success: true, data: {...} }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
