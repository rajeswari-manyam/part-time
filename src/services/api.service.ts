import axios from "axios";

// ✅ UPDATED: Changed to match your actual backend IP
export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://192.168.1.22:3000";

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
});

export const registerWithOtp = async (data: {
    phone: string;
    name: string;
    latitude: number;
    longitude: number;
}) => {
    try {
        const cleanPhone = data.phone.replace(/\D/g, '').slice(-10);

        console.log("Registering with:", {
            phone: cleanPhone,
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude
        });

        const urlencoded = new URLSearchParams();
        urlencoded.append("phone", cleanPhone);
        urlencoded.append("name", data.name);
        urlencoded.append("latitude", data.latitude.toString());
        urlencoded.append("longitude", data.longitude.toString());

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Registration error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const verifyOtp = async (data: { phone: string; otp: string }) => {
    try {
        const cleanPhone = data.phone.replace(/\D/g, '').slice(-10);

        console.log("Verifying OTP with:", {
            phone: cleanPhone,
            otp: data.otp
        });

        const urlencoded = new URLSearchParams();
        urlencoded.append("phone", cleanPhone);
        urlencoded.append("otp", data.otp);

        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Verify OTP error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Verify OTP failed:", error);
        throw error;
    }
};

export const resendOtp = async (phone: string) => {
    try {
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);

        console.log("Resending OTP to:", cleanPhone);

        const urlencoded = new URLSearchParams();
        urlencoded.append("phone", cleanPhone);

        const response = await fetch(`${API_BASE_URL}/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Resend OTP error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Resend OTP failed:", error);
        throw error;
    }
};

export interface CreateJobPayload {
    userId: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    jobType: "FULL_TIME" | "PART_TIME";
    servicecharges: string;
    startDate: string;
    endDate: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
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

    if (data.subcategory) {
        formData.append("subcategory", data.subcategory);
    }

    formData.append("jobType", data.jobType);
    formData.append("servicecharges", data.servicecharges);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("area", data.area);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("pincode", data.pincode);
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
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

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
    images?: File[];
}

export const updateJob = async (jobId: string, payload: any) => {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subcategory) formData.append("subcategory", payload.subcategory);
    if (payload.price) formData.append("price", payload.price);
    if (payload.location) formData.append("location", payload.location);
    if (payload.latitude) formData.append("latitude", payload.latitude.toString());
    if (payload.longitude) formData.append("longitude", payload.longitude.toString());

    if (payload.images && payload.images.length > 0) {
        payload.images.forEach((image: File) => {
            formData.append("images", image);
        });
    }

    const response = await fetch(`${API_BASE_URL}/updateJob/${jobId}`, {
        method: "PUT",
        body: formData,
    });

    return response.json();
};

export const getNearbyWorkers = async (
    latitude: number,
    longitude: number,
    range: number,
    category: string,
    subcategory: string
) => {
    const cleanCategory = category.trim();
    const cleanSubcategory = subcategory.trim();

    const url = `${API_BASE_URL}/getNearbyWorkers?latitude=${latitude}&longitude=${longitude}&range=${range}&category=${encodeURIComponent(cleanCategory)}&subcategory=${encodeURIComponent(cleanSubcategory)}`;

    console.log('Fetching workers with URL:', url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
};

export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export interface GetNearbyWorkersParams {
    latitude: number;
    longitude: number;
    range?: number;
}

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
        return response.data;
    } catch (error) {
        console.error("Error fetching user jobs:", error);
        throw error;
    }
};

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
        return response.data;
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

export const updateUserById = async (userId: string, payload: UpdateUserPayload) => {
    try {
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
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

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
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};