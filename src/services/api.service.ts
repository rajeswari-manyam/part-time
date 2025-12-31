import axios from "axios";

export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://192.168.1.6:3000";

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

export const updateJob = async (jobId: string, data: UpdateJobPayload) => {
    try {
        const formData = new FormData();

        // Dynamically append fields if provided
        Object.keys(data).forEach((key) => {
            const value = (data as any)[key];
            if (value !== undefined && value !== null) {
                if (key === "images" && Array.isArray(value)) {
                    value.forEach((file: File) => formData.append("images", file));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await API_MULTIPART.put(`/updateJob/${jobId}`, formData);
        return response.data; // API should return updated job object
    } catch (error) {
        console.error("Error updating job:", error);
        throw error;
    }
};
